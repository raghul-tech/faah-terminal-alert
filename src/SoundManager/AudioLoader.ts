import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export class AudioLoader {
    public loadSoundIntoMemory(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel): string {
        const soundPath = path.join(context.extensionPath, 'media', 'faah.wav');
        if (fs.existsSync(soundPath)) {
            const soundBuffer = fs.readFileSync(soundPath);
            const base64 = soundBuffer.toString('base64');
            outputChannel.appendLine(`Sound loaded in memory: ${(soundBuffer.length / 1024).toFixed(1)} KB`);
            return base64;
        }        
        outputChannel.appendLine('No sound file found at: ' + soundPath);
        return '';
    }
    
    public createCachedSoundFile(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel): string {
        const originalPath = path.join(context.extensionPath, 'media', 'faah.wav');
        
        if (fs.existsSync(originalPath)) {
            const cachedSoundPath = path.join(os.tmpdir(), 'faah_cached.wav');
            if (!fs.existsSync(cachedSoundPath)) {
                const soundData = fs.readFileSync(originalPath);
                fs.writeFileSync(cachedSoundPath, soundData);
                outputChannel.appendLine(`Sound cached: ${cachedSoundPath} (${(soundData.length / 1024).toFixed(1)} KB)`);
            } else {
                outputChannel.appendLine(`Using existing cache: ${cachedSoundPath}`);
            }
            return cachedSoundPath;
        }
        outputChannel.appendLine('Failed to create cached sound file - original not found');
        return '';
    }
}