import { AudioLoader } from "./AudioLoader";
import {exec, ExecOptions} from 'child_process';

export class SoundFallBack {
   private cachedSoundPath: string = "";
    
    constructor(audioLoader: AudioLoader) {
        this.cachedSoundPath = audioLoader.createCachedSoundFile();
        }

        private executeCommand(command: string ,options : ExecOptions = {} ): Promise<boolean> {
            return new Promise((resolve) => {
                try{
                    const process = exec(command,options, (error) => {
                         if (error) {
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
                
            } catch (error) {
                resolve(false);
            }

            });
        }
        
        public winFallBack(): Promise<boolean> {
            const escapedPath = this.cachedSoundPath.replace(/'/g, "''");
            const psCommand = `(New-Object Media.SoundPlayer '${escapedPath}').PlaySync();`;
            return  this.executeCommand(`powershell -Command "${psCommand}"`, { windowsHide: true, maxBuffer: 1024 * 1024 });
        }

        public macFallBack(): Promise<boolean> {
            const escapedPath = this.cachedSoundPath.replace(/(["\s])/g, '\\$1');
            return  this.executeCommand(`afplay "${escapedPath}"`);
        }

        public  linuxFallBack(): Promise<boolean> {
            const escapedPath = this.cachedSoundPath.replace(/(["\s])/g, '\\$1');
            const command = `aplay "${escapedPath}" 2>/dev/null || paplay "${escapedPath}" 2>/dev/null || play "${escapedPath}" 2>/dev/null`;
            return this.executeCommand(command);
        }
    
}