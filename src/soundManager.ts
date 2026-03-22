import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec, spawn } from 'child_process';
import * as os from 'os';

export class SoundManager {
    private context: vscode.ExtensionContext;
    private outputChannel: vscode.OutputChannel;
    private soundFile: string = "";
    private platform: string;
    private soundLoaded: boolean = false;
    private tempSoundFile: string = "";
    private lastPlayedTime: number = 0;
    private minInterval: number = 100;

    constructor(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
        this.context = context;
        this.outputChannel = outputChannel;
        this.platform = process.platform;
        this.initialize();
    }

    private initialize(): void {
        this.findSoundFile();
        
        if (this.soundFile) {
            this.soundLoaded = true;
            this.createTempCache();
            this.outputChannel.appendLine(`✓ Sound system ready: ${path.basename(this.soundFile)}`);
            this.outputChannel.appendLine(`  Platform: ${this.platform}`);
        } else {
            this.outputChannel.appendLine('⚠ No sound file found - using system beep');
        }
    }

    private findSoundFile(): void {
        const possiblePaths = [
            path.join(this.context.extensionPath, 'media', 'faah.wav'),
            path.join(this.context.extensionPath, 'faah.wav'),
            path.join(this.context.extensionUri.fsPath, 'media', 'faah.wav'),
            path.join(__dirname, '..', 'media', 'faah.wav'),
            path.join(__dirname, 'media', 'faah.wav'),
        ];

        for (const filePath of possiblePaths) {
            try {
                if (filePath && fs.existsSync(filePath)) {
                    this.soundFile = filePath;
                    break;
                }
            } catch (e) {
                // Ignore errors
            }
        }
    }

    private createTempCache(): void {
        try {
            // Read and cache the sound file
            const soundBuffer = fs.readFileSync(this.soundFile);
            const tempDir = os.tmpdir();
            // Use short path without spaces for Windows
            const ext = path.extname(this.soundFile);
            this.tempSoundFile = path.join(tempDir, `faah_${Date.now()}${ext}`);
            
            fs.writeFileSync(this.tempSoundFile, soundBuffer);
            this.outputChannel.appendLine(`✓ Sound cached: ${(soundBuffer.length / 1024).toFixed(1)} KB`);
            this.outputChannel.appendLine(`  Cache path: ${this.tempSoundFile}`);
        } catch (error) {
            this.outputChannel.appendLine(`⚠ Cache failed, using original file: ${error}`);
            this.tempSoundFile = this.soundFile;
        }
    }

    public async play(): Promise<boolean> {
        // Rate limiting
        const now = Date.now();
        if (now - this.lastPlayedTime < this.minInterval) {
            return false;
        }
        
        this.lastPlayedTime = now;

        if (!this.soundLoaded || !this.soundFile) {
            return this.systemBeep();
        }

        try {
            const startTime = Date.now();
            let result = false;
            
            // Platform-specific fast playback
            if (this.platform === 'win32') {
                result = await this.playWindowsFast();
            } else if (this.platform === 'darwin') {
                result = await this.playMacFast();
            } else {
                result = await this.playLinuxFast();
            }
            
            const elapsed = Date.now() - startTime;
            if (elapsed > 5) {
                this.outputChannel.appendLine(`✓ Sound played in ${elapsed}ms`);
            }
            
            return result;
        } catch (error) {
            this.outputChannel.appendLine(`✗ Playback error: ${error}`);
            return this.systemBeep();
        }
    }

    private async playWindowsFast(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                // Escape the path properly for PowerShell
                const escapedPath = this.tempSoundFile.replace(/'/g, "''");
                
                // Method 1: Try using Windows Media Player via PowerShell with proper escaping
                const psCommand = `(New-Object Media.SoundPlayer '${escapedPath}').PlaySync();`;
                
                const process = exec(`powershell -Command "${psCommand}"`, { 
                    windowsHide: true,
                    maxBuffer: 1024 * 1024
                }, (error, stdout, stderr) => {
                    if (error) {
                        // If PowerShell fails, try fallback method
                        this.playWindowsFallback().then(resolve);
                    } else {
                        resolve(true);
                    }
                });
                
                // Timeout after 100ms
                setTimeout(() => {
                    if (process && !process.killed) {
                        process.kill();
                        resolve(true);
                    }
                }, 100);
                
            } catch (error) {
                this.outputChannel.appendLine(`Windows playback error: ${error}`);
                this.playWindowsFallback().then(resolve);
            }
        });
    }

    private async playWindowsFallback(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                // Method 2: Use Windows built-in sound player (rundll32)
                const shortPath = this.getShortPathName(this.tempSoundFile);
                const command = `rundll32.exe shell32.dll,OpenAs_RunDLL "${shortPath || this.tempSoundFile}"`;
                
                exec(command, { windowsHide: true }, (error) => {
                    if (error) {
                        // Method 3: Simple system beep
                        this.systemBeepFast();
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            } catch (error) {
                this.systemBeepFast();
                resolve(false);
            }
        });
    }

    private getShortPathName(longPath: string): string | null {
        try {
            // Get short path name (8.3 format) to avoid spaces
            const result = execSync(`cmd /c for %A in ("${longPath}") do @echo %~sA`, { 
                encoding: 'utf8',
                windowsHide: true 
            });
            return result.trim();
        } catch (error) {
            return null;
        }
    }

    private async playMacFast(): Promise<boolean> {
        return new Promise((resolve) => {
            const escapedPath = this.tempSoundFile.replace(/(["\s])/g, '\\$1');
            const process = exec(`afplay "${escapedPath}"`, (error) => {
                if (error) {
                    this.systemBeepFast();
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
            
            setTimeout(() => {
                if (process && !process.killed) {
                    process.kill();
                    resolve(true);
                }
            }, 100);
        });
    }

    private async playLinuxFast(): Promise<boolean> {
        return new Promise((resolve) => {
            const escapedPath = this.tempSoundFile.replace(/(["\s])/g, '\\$1');
            const command = `aplay "${escapedPath}" 2>/dev/null || paplay "${escapedPath}" 2>/dev/null || play "${escapedPath}" 2>/dev/null`;
            const process = exec(command, (error) => {
                if (error) {
                    this.systemBeepFast();
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
            
            setTimeout(() => {
                if (process && !process.killed) {
                    process.kill();
                    resolve(true);
                }
            }, 100);
        });
    }

    private systemBeepFast(): void {
        if (this.platform === 'win32') {
            exec('powershell -c "[Console]::Beep(880,100)"', { windowsHide: true });
        } else if (this.platform === 'darwin') {
            exec('printf "\\a"', { shell: '/bin/bash' });
        } else {
            process.stdout.write('\x07');
        }
    }

    private async systemBeep(): Promise<boolean> {
        this.systemBeepFast();
        return true;
    }

    public async testSound(): Promise<number> {
        const start = Date.now();
        await this.play();
        return Date.now() - start;
    }

    public cleanup(): void {
        if (this.tempSoundFile && this.tempSoundFile !== this.soundFile && fs.existsSync(this.tempSoundFile)) {
            try {
                fs.unlinkSync(this.tempSoundFile);
                this.outputChannel.appendLine('✓ Temp cache cleaned up');
            } catch (error) {
                // Ignore
            }
        }
    }
}

// Helper for execSync
function execSync(command: string, options: { encoding: string; windowsHide: boolean }): string {
    const { execSync } = require('child_process');
    return execSync(command, options);
}