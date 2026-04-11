import { StatusBar } from "../StatusBar";
import { DebugService } from "./DebugService";
import * as vscode from 'vscode';
import { SoundManager } from "../SoundManager/SoundPlayer";

export class ChangeConfigService{

      private debugService: DebugService;
        private statusBar: StatusBar;
        private context: vscode.ExtensionContext;
        private soundEnabled: boolean;
    
        constructor(context: vscode.ExtensionContext,debugService: DebugService, statusBar: StatusBar,soundEnabled:boolean) {
            this.context = context;
            this.debugService = debugService;
            this.statusBar = statusBar;
            this.soundEnabled = soundEnabled;
        }
    
     public commandChangeConfiguration(soundStatusBarItem: vscode.StatusBarItem,debugStatusBarItem: vscode.StatusBarItem, soundManager: SoundManager){
            this.context.subscriptions.push(
                    vscode.workspace.onDidChangeConfiguration((e) => {
                        if (!e.affectsConfiguration('faah-terminal-alert')) return;
            
                        const updatedConfig = vscode.workspace.getConfiguration('faah-terminal-alert');
                        const updatedEnabled = updatedConfig.get('enabled', true);
                        const updatedDebugEnabled = updatedConfig.get('debugEnabled', false);
                        const updatedCooldownMs = updatedConfig.get<number>('cooldown', 1000);
                        this.soundEnabled = updatedEnabled;
                        this.statusBar.updateSoundStatusBar(soundStatusBarItem, this.soundEnabled);
                        this.debugService.setDebugEnabled(updatedDebugEnabled);
                        this.statusBar.updateDebugStatusBar(debugStatusBarItem, updatedDebugEnabled);
                        soundManager.setCooldownMs(updatedCooldownMs);
                    })
                );
        }

        public getSoundEnabled():boolean{
            return this.soundEnabled
        }

}