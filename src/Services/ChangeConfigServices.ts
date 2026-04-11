import { StatusBar } from "../StatusBar";
import { DebugService } from "./DebugService";
import * as vscode from 'vscode';
import { SoundManager } from "../SoundManager/SoundPlayer";
import { MonitoringService } from "./MonitoringService";

export class ChangeConfigService{

      private debugService: DebugService;
        private statusBar: StatusBar;
        private context: vscode.ExtensionContext;
        private monitoringService: MonitoringService;
    
        constructor(context: vscode.ExtensionContext,debugService: DebugService, statusBar: StatusBar, monitoringService: MonitoringService) {
            this.context = context;
            this.debugService = debugService;
            this.statusBar = statusBar;
            this.monitoringService = monitoringService;
        }
    
     public commandChangeConfiguration(soundStatusBarItem: vscode.StatusBarItem,debugStatusBarItem: vscode.StatusBarItem, soundManager: SoundManager){
            this.context.subscriptions.push(
                    vscode.workspace.onDidChangeConfiguration((e) => {
                        if (!e.affectsConfiguration('faah-terminal-alert')) return;
            
                        const updatedConfig = vscode.workspace.getConfiguration('faah-terminal-alert');
                        if (e.affectsConfiguration('faah-terminal-alert.enabled')) {
                            const updatedEnabled = updatedConfig.get('enabled', true);
                            this.monitoringService.setSoundEnabled(updatedEnabled);
                            this.statusBar.updateSoundStatusBar(soundStatusBarItem, updatedEnabled);
                        }             
                        if (e.affectsConfiguration('faah-terminal-alert.debugEnabled')) {
                            const updatedDebugEnabled = updatedConfig.get('debugEnabled', false);
                            this.debugService.setDebugEnabled(updatedDebugEnabled);
                            this.statusBar.updateDebugStatusBar(debugStatusBarItem, updatedDebugEnabled);
                        }
                        if (e.affectsConfiguration('faah-terminal-alert.cooldown')) {
                            const updatedCooldownMs = updatedConfig.get<number>('cooldown', 1000);
                            soundManager.setCooldownMs(updatedCooldownMs);
                        }
                    })
                );
        }

}