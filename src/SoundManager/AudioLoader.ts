import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { DebugService } from '../utils/DebugService';

export class AudioLoader {

    private context: vscode.ExtensionContext;
    private debugService: DebugService;
    private cachedSoundPath: string = "";
    constructor(context: vscode.ExtensionContext, debugService: DebugService) {
        this.context = context;
        this.debugService = debugService;
    }

    private getSoundFilePath(): string {
        const soundPath = path.join(this.context.extensionPath, 'media', 'faah.wav');
        if (fs.existsSync(soundPath)) {
            this.debugService.debug(`AudioLoader: sound file found at '${soundPath}'`);
            return soundPath;
        }
        this.debugService.error(`AudioLoader: sound file not found at '${soundPath}'`);
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
            this.debugService.debug(`AudioLoader: loaded sound into memory from '${soundPath}' (${(soundBuffer.length / 1024).toFixed(1)} KB)`);
            return base64;
        }        
        this.debugService.error("AudioLoader: sound file not found (expected 'media/faah.wav' in extension folder)");
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
                this.debugService.debug(`AudioLoader: created cached sound file at '${this.cachedSoundPath}' (${(soundData.length / 1024).toFixed(1)} KB)`);
            } else {
                this.debugService.debug(`AudioLoader: using existing cached sound file at '${this.cachedSoundPath}'`);
            }
            return this.cachedSoundPath;
        }
        this.debugService.error("AudioLoader: cannot create cached sound file because the original sound file was not found");
        return soundPath;
    }

}