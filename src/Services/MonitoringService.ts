import * as vscode from 'vscode';
import { DebugService } from './DebugService';
import { SoundManager } from '../SoundManager/SoundPlayer';
export class MonitoringService {

    private debugService: DebugService;
    private context: vscode.ExtensionContext

    
    constructor(context: vscode.ExtensionContext,debugService: DebugService, ) {
        this.debugService = debugService;
        this.context = context
    }

    
    public setupTerminalMonitoring(soundEnabled: boolean,soundManager: SoundManager): void {
        if (vscode.window.onDidEndTerminalShellExecution) {
            this.debugService.debug('Terminal monitoring: onDidEndTerminalShellExecution listener registered');
    
            this.context.subscriptions.push(
                vscode.window.onDidEndTerminalShellExecution(async (e) => {
                    if (!soundEnabled) {
                        this.debugService.debug(`Terminal monitoring: sound is disabled. ignoring terminal exit event in terminal ${e.terminal.name}`);
                        return;
                    }
                    const exitCode = e.exitCode;
                    this.debugService.debug(`Terminal monitoring: shell execution ended. exitCode=${exitCode} in terminal ${e.terminal.name}`);
                    if (exitCode === undefined) {
                        this.debugService.error(`Terminal monitoring: exitCode is undefined; nothing to do in terminal ${e.terminal.name}`);
                        return;
                    }
                    if (exitCode !== 0) {
                        this.debugService.debug(`Terminal command failed with exit code ${exitCode}. Attempting to play alert sound in terminal ${e.terminal.name}`);
                        soundManager.play()
                            .then((played) => {
                                if (played) {
                                    this.debugService.success(`FAAH terminal alert: sound played successfully in terminal ${e.terminal.name}`);
                                } else {
                                    this.debugService.debug(`FAAH terminal alert: sound skipped due to cooldown in terminal ${e.terminal.name}`);
                                }
                            })
                            .catch((err) => {
                                this.debugService.error(`Failed to play alert sound in terminal ${e.terminal.name}: ${err instanceof Error ? err.message : String(err)}`);
                            });
                    }
                })
            );
    
        } else {
            this.debugService.error('Terminal monitoring: onDidEndTerminalShellExecution API not available in this VS Code version');
        }
    }
}