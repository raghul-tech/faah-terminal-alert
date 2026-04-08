import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { AudioLoader } from './AudioLoader';
import { ProcessManager } from './ProcessManager';
import { SoundFallBack } from './SoundFallBack';

export class SoundManager {
    private persistentProcess: any = null;
    private soundBase64: string = "";
    private platform: string; 
    private outputChannel: vscode.OutputChannel;
    private lastPlayedTime: number = 0;
    private minInterval: number = 100;
    private cachedSoundPath: string = "";
    private audioLoader: AudioLoader;
    private processManager: ProcessManager;

    constructor(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
        this.platform = process.platform;
        this.outputChannel = outputChannel;
        this.audioLoader = new AudioLoader(context, outputChannel);
        this.processManager = new ProcessManager();
        
        if (this.platform === "win32") {
            this.soundBase64 = this.audioLoader.loadSoundIntoMemory();
            this.outputChannel.appendLine(`Windows mode: Sound Base64 loaded (${this.soundBase64.length} chars)`);
        } else {
            this.cachedSoundPath = this.audioLoader.createCachedSoundFile();
            this.outputChannel.appendLine(`Unix mode: Sound cached at ${this.cachedSoundPath}`);
        }
        this.startSoundProcess();
    }

    private startSoundProcess(): void {
        try {
            if (this.platform === 'win32') {
                if (!this.soundBase64) {
                    this.outputChannel.appendLine('No sound Base64 available for Windows');
                    return;
                }
                
                this.processManager.startWindowsProcess(this.soundBase64).then(({ persistentProcess }) => {
                    this.persistentProcess = persistentProcess;
                    this.outputChannel.appendLine('Windows sound process ready');
                }).catch(err => {
                    this.outputChannel.appendLine(`Failed to start Windows sound process: ${err.message}`);
                });
            } else {
                if (!this.cachedSoundPath) {
                    this.outputChannel.appendLine('No cached sound file for Unix');
                    return;
                }
                
                this.processManager.startUnixProcess(this.cachedSoundPath).then(({ persistentProcess, pipePath }) => {
                    this.persistentProcess = persistentProcess;
                    this.persistentProcess.pipePath = pipePath;
                    this.outputChannel.appendLine(`Unix sound process ready with pipe: ${pipePath}`);
                }).catch(err => {                   
                    this.outputChannel.appendLine(`Failed to start Unix sound process: ${err.message}`);
                });
            }
        } catch (error) {
            this.outputChannel.appendLine(`Failed to start persistent process: ${error}`);
        }
    }

    public async play(): Promise<boolean> {
        const now = Date.now();
        if (now - this.lastPlayedTime < this.minInterval) return false;
        this.lastPlayedTime = now;

        if (!this.soundBase64 && !this.cachedSoundPath) {
            this.outputChannel.appendLine(`No sound data available, using fallback beep`);
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
                    this.outputChannel.appendLine(`Windows sound triggered`);
                } else {
                    this.outputChannel.appendLine(`Windows process stdin not available, using fallback`);
                    this.playFallback();
                }
            } 
            else if (this.persistentProcess && this.persistentProcess.pipePath) {
                const writeProcess = spawn('bash', ['-c', `echo "play" > ${this.persistentProcess.pipePath} 2>/dev/null &`]);
                setTimeout(() => {
                    if (!writeProcess.killed) writeProcess.kill();
                }, 50);
                this.outputChannel.appendLine(`Unix sound triggered via pipe`);
            }
            else {
                this.outputChannel.appendLine(`No persistent process, using fallback`);
                this.playFallback();
            }
            
            const elapsed = Date.now() - startTime;
            if (elapsed > 2) {
                this.outputChannel.appendLine(`Sound played in ${elapsed}ms`);
            }
            
            return true;
        } catch (error) {
            this.outputChannel.appendLine(`Failed to play sound: ${error}`);
           return this.playFallback()
        }
    }

    private async playFallback(): Promise<boolean> {
        const fallback = new SoundFallBack(this.audioLoader);
        switch (this.platform) {
            case 'win32':
                return fallback.winFallBack();    
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
            this.outputChannel.appendLine('Sound process cleaned up');
        }
    }
}