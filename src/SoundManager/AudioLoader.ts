import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export class AudioLoader {

    private context: vscode.ExtensionContext;
    private outputChannel: vscode.OutputChannel;
    private cachedSoundPath: string = "";
    constructor(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
        this.context = context;
        this.outputChannel = outputChannel;
    }

    private getSoundFilePath(): string {
        const soundPath = path.join(this.context.extensionPath, 'media', 'faah.wav');
        if (fs.existsSync(soundPath)) {
            return soundPath;
        }
        return '';
    }

    private createTempFile(soundPath: string): string {
        const ext = path.extname(soundPath);
        const tempFile = path.join(os.tmpdir(), `faah_terminal_alert${ext}`);
        return tempFile;
    }

    public loadSoundIntoMemory(): string {
        const soundPath = this.getSoundFilePath();
        if (soundPath) {
            const soundBuffer = fs.readFileSync(soundPath);
            const base64 = soundBuffer.toString('base64');
            this.outputChannel.appendLine(`Sound loaded in memory: ${(soundBuffer.length / 1024).toFixed(1)} KB`);
            return base64;
        }        
        this.outputChannel.appendLine('No sound file found at: ' + soundPath);
        return soundPath;
    }
    
    public createCachedSoundFile(): string {
        const soundPath = this.getSoundFilePath();

        if (soundPath) {
           if (!this.cachedSoundPath) {
                this.cachedSoundPath = this.createTempFile(soundPath);
            }
            if (!fs.existsSync(this.cachedSoundPath)) {
                const soundData = fs.readFileSync(soundPath);
                fs.writeFileSync(this.cachedSoundPath, soundData);
                this.outputChannel.appendLine(`Sound cached: ${this.cachedSoundPath} (${(soundData.length / 1024).toFixed(1)} KB)`);
            } else {
                this.outputChannel.appendLine(`Using existing cache: ${this.cachedSoundPath}`);
            }
            return this.cachedSoundPath;
        }
        this.outputChannel.appendLine('Failed to create cached sound file - original not found');
        return soundPath;
    }

}