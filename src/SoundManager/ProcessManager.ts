import { spawn } from 'child_process';
import * as fs from 'fs';  

export class ProcessManager {
    public startWindowsProcess(soundBase64: string): Promise<{ persistentProcess: any }> {
        return new Promise((resolve, reject) => {
            try {
                const persistentProcess = spawn('powershell.exe', [
                    '-NoLogo',
                    '-NoProfile',
                    '-ExecutionPolicy', 'Bypass',
                    '-Command', '-'
                ], { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });

                let isResolved = false;

                persistentProcess.on('error', (err) => {
                    if (!isResolved) {
                        isResolved = true;
                        reject(new Error(`Failed to start process: ${err.message}`));
                    }
                });

                const initScript = `
                    Add-Type -AssemblyName System.Windows.Forms;
                    $script:soundPlayer = New-Object System.Media.SoundPlayer;
                    $script:memoryStream = New-Object System.IO.MemoryStream;
                    $script:soundBytes = [System.Convert]::FromBase64String('${soundBase64}');
                    $script:memoryStream.Write($script:soundBytes, 0, $script:soundBytes.Length);
                    $script:memoryStream.Position = 0;
                    $script:soundPlayer.Stream = $script:memoryStream;
                    Write-Host "READY";
                `;

                persistentProcess.stdin.write(initScript + "\n");
                
                persistentProcess.stdout.on('data', (data: Buffer) => {
                    if (!isResolved && data.toString().includes('READY')) {
                        isResolved = true;
                        resolve({ persistentProcess });
                    }
                });
                
                setTimeout(() => {
                    if (!isResolved) {
                        isResolved = true;
                        reject(new Error('Windows process startup timeout'));
                    }
                }, 5000);
                
            } catch (err: any) {
                reject(new Error(`Unexpected error: ${err.message}`));
            }
        });
    }

    public startUnixProcess(cachedSoundPath: string): Promise<{ persistentProcess: any, pipePath: string }> {
        return new Promise((resolve, reject) => {
            if (!cachedSoundPath) {
                return reject(new Error('No cached sound file for Unix'));
            }

            const pipePath = '/tmp/faah_sound_pipe';
            
            try {
                if (fs.existsSync(pipePath)) {
                    fs.unlinkSync(pipePath);
                }
            } catch (e) {}

            const mkfifo = spawn('mkfifo', [pipePath]);
            mkfifo.on('error', (err) => {
                reject(new Error(`mkfifo error: ${err.message}`));
            });
            mkfifo.on('exit', (code) => {
                if (code !== 0) {
                    return reject(new Error(`mkfifo failed with code ${code}`));
                }
                const isMac = process.platform === 'darwin';
                const playCmd = isMac 
                    ? `afplay "${cachedSoundPath}" 2>/dev/null`
                    : `aplay "${cachedSoundPath}" 2>/dev/null || paplay "${cachedSoundPath}" 2>/dev/null`;
                const persistentProcess = spawn('bash', ['-c', `
                    while true; do
                        if read -r line < ${pipePath}; then
                            ${playCmd}
                        fi
                    done
                `], { stdio: 'ignore' });
                
                persistentProcess.on('error', (err) => {
                    reject(new Error(`Bash process error: ${err.message}`));
                });
                
                resolve({ persistentProcess, pipePath });
            });
        });
    }
}