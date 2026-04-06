import { exec, spawn } from 'child_process';

export class Beeper {
    public instantBeep(platform: string): Promise<boolean> {
        try {
            if (platform === 'win32') {
                exec('powershell -c "[Console]::Beep(880,100)"', { windowsHide: true });
            } else if (platform === 'darwin') {
                spawn('printf', ['\\a'], { shell: '/bin/bash', stdio: 'ignore' });
            } else {
                process.stdout.write('\x07');
            }
            return Promise.resolve(true);
        } catch (error) {
            return Promise.resolve(false);
        }
    }
}