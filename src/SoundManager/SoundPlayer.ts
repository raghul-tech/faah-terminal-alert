import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { AudioLoader } from './AudioLoader';
import { ProcessManager } from './ProcessManager';
import { SoundFallBack } from './SoundFallBack';
import { DebugService } from '../Services/DebugService';

export class SoundManager {
    private persistentProcess: any = null;
    private soundBase64: string = "";
    private platform: string; 
    private lastPlayedTime: number = 0;
    private cooldownMs: number = 1000;
    private cachedSoundPath: string = "";
    private audioLoader: AudioLoader;
    private processManager: ProcessManager;
    private debugService: DebugService;

    constructor(context: vscode.ExtensionContext, debugService: DebugService, cooldownMs?: number) {
        this.platform = process.platform;
        this.debugService = debugService;
        this.audioLoader = new AudioLoader(context, debugService);
        this.processManager = new ProcessManager();
        if (typeof cooldownMs === 'number' && Number.isFinite(cooldownMs) && cooldownMs >= 0) {
            this.cooldownMs = cooldownMs;
        }
        this.debugService.debug(`SoundManager: initializing (platform='${this.platform}')`);
        
        if (this.platform === "win32") {
            this.soundBase64 = this.audioLoader.loadSoundIntoMemory();
            if (this.soundBase64) {
                this.debugService.debug(`SoundManager: Windows mode ready (sound loaded into memory; base64Length=${this.soundBase64.length})`);
            } else {
                this.debugService.warn('SoundManager: Windows mode selected but sound could not be loaded; will rely on fallback');
            }
        } else {
            this.cachedSoundPath = this.audioLoader.createCachedSoundFile();
            if (this.cachedSoundPath) {
                this.debugService.debug(`SoundManager: Unix mode ready (cachedSoundPath='${this.cachedSoundPath}')`);
            } else {
                this.debugService.warn('SoundManager: Unix mode selected but sound cache could not be created; will rely on fallback');
            }
        }
        this.startSoundProcess();
    }

    public setCooldownMs(cooldownMs: number): void {
        if (!Number.isFinite(cooldownMs) || cooldownMs < 0) return;
        this.cooldownMs = cooldownMs;
    }

    public async testSound(): Promise<boolean> {
        const previousLastPlayedTime = this.lastPlayedTime;
        this.lastPlayedTime = 0;
        try {
            this.debugService.debug('SoundManager: testSound() invoked (bypassing cooldown)');
            return await this.play();
        } finally {
            this.lastPlayedTime = previousLastPlayedTime;
        }
    }

    private startSoundProcess(): void {
        try {
            if (this.platform === 'win32') {
                if (!this.soundBase64) {
                    this.debugService.warn('SoundManager: Windows persistent player not started because soundBase64 is empty');
                    return;
                }
                
                this.processManager.startWindowsProcess(this.soundBase64).then(({ persistentProcess }) => {
                    this.persistentProcess = persistentProcess;
                    this.debugService.success('SoundManager: Windows persistent sound process started and ready');
                }).catch(err => {
                    this.debugService.error(`SoundManager: failed to start Windows persistent sound process: ${err instanceof Error ? err.message : String(err)}`);
                });
            } else {
                if (!this.cachedSoundPath) {
                    this.debugService.warn('SoundManager: Unix persistent player not started because cachedSoundPath is empty');
                    return;
                }
                
                this.processManager.startUnixProcess(this.cachedSoundPath).then(({ persistentProcess, pipePath }) => {
                    this.persistentProcess = persistentProcess;
                    this.persistentProcess.pipePath = pipePath;
                    this.debugService.success(`SoundManager: Unix persistent sound process started and ready (pipePath='${pipePath}')`);
                }).catch(err => {                   
                    this.debugService.error(`SoundManager: failed to start Unix persistent sound process: ${err instanceof Error ? err.message : String(err)}`);
                });
            }
        } catch (error) {
            this.debugService.error(`SoundManager: unexpected error while starting persistent sound process: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async play(): Promise<boolean> {
        const now = Date.now();
        if (now - this.lastPlayedTime < this.cooldownMs) {
            this.debugService.debug(`SoundManager: play() skipped due to cooldown (${now - this.lastPlayedTime}ms/${this.cooldownMs}ms)`);
            return false;
        }
        this.lastPlayedTime = now;

        if (!this.soundBase64 && !this.cachedSoundPath) {
            this.debugService.warn('SoundManager: no sound data available (memory/cache empty); using fallback');
            return this.playFallback()
        }
        try {
            const startTime = Date.now();
            
            if (this.platform === 'win32' && this.persistentProcess) {
                if (this.persistentProcess.stdin && !this.persistentProcess.stdin.destroyed) {
                    this.persistentProcess.stdin.write(`
                        $script:memoryStream.Position = 0;
                        $script:soundPlayer.Play();
                    `);
                    this.debugService.debug('SoundManager: Windows sound triggered via persistent PowerShell process');
                } else {
                    this.debugService.warn('SoundManager: Windows persistent process is present but stdin is not writable; using fallback');
                    return this.playFallback();
                }
            } 
            else if (this.persistentProcess && this.persistentProcess.pipePath) {
                const writeProcess = spawn('bash', ['-c', `echo "play" > ${this.persistentProcess.pipePath} 2>/dev/null &`]);
                setTimeout(() => {
                    if (!writeProcess.killed) writeProcess.kill();
                }, 50);
                this.debugService.debug(`SoundManager: Unix sound triggered via pipe (pipePath='${this.persistentProcess.pipePath}')`);
            }
            else {
                this.debugService.warn('SoundManager: persistent sound process not ready; using fallback');
                return this.playFallback();
            }
            
            const elapsed = Date.now() - startTime;
            if (elapsed > 2) {
                this.debugService.debug(`SoundManager: play() completed in ${elapsed}ms`);
            }
            
            return true;
        } catch (error) {
            this.debugService.error(`SoundManager: play() failed with error: ${error instanceof Error ? error.message : String(error)}`);
           return this.playFallback()
        }
    }

    private async playFallback():Promise<boolean> {
        return this.soundFallback().then(() => {
            this.debugService.success('SoundManager: fallback sound played successfully');
            return true;
        }).catch((error) => {
            this.debugService.error(`SoundManager: fallback sound failed ${error instanceof Error ? error.message : String(error)}`);
            return false;
        });
    }

    private async soundFallback(): Promise<boolean> {
        const fallback = new SoundFallBack(this.audioLoader);
        switch (this.platform) {
            case 'win32':
                return fallback.winFallBack()   
            case 'darwin':  
                return fallback.macFallBack();
            default:
                return fallback.linuxFallBack();
        }
    }

    public cleanup(): void {
        if (this.persistentProcess) {
            if (this.persistentProcess.pipePath) {
                try {
                    fs.unlinkSync(this.persistentProcess.pipePath);
                } catch (e) {}
            }
            if (this.persistentProcess.kill) {
                this.persistentProcess.kill();
            }
            this.debugService.debug('SoundManager: persistent sound process cleaned up');
        }
    }
}