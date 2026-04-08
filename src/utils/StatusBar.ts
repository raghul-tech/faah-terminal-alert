import * as vscode from 'vscode';

export class StatusBar {

    public updateSoundStatusBar(soundStatusBarItem: vscode.StatusBarItem, soundEnabled: boolean): void {
        if (soundStatusBarItem) {
            soundStatusBarItem.text = soundEnabled ? "$(bell) FAAH Terminal Alert" : "$(bell-slash) FAAH Terminal Alert";
            soundStatusBarItem.tooltip = soundEnabled ? "FAAH Terminal Alert: Enabled" : "FAAH Terminal Alert: Disabled";
        }
    }
    
    public updateDebugStatusBar(debugStatusBarItem: vscode.StatusBarItem, debugEnabled: boolean): void {
        if (debugStatusBarItem) {
            debugStatusBarItem.text = debugEnabled ? "$(debug-alt) Debug ON" : "$(debug-alt-small) Debug OFF";
            debugStatusBarItem.tooltip = debugEnabled ? "Debug: ON - Click to disable" : "Debug: OFF - Click to enable";
        }
    }
}