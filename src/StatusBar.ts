import * as vscode from 'vscode';

export class StatusBar {

    public updateSoundStatusBar(soundStatusBarItem: vscode.StatusBarItem, soundEnabled: boolean): void {
        if (soundStatusBarItem) {
            soundStatusBarItem.text = soundEnabled ? "$(bell) FAAH Terminal Alert" : "$(bell-slash) FAAH Terminal Alert";
            soundStatusBarItem.tooltip = soundEnabled ? "FAAH Terminal Alert: Enabled" : "FAAH Terminal Alert: Disabled";
        }
    }
    public updateTestSoundStatusBar(testSoundStatusBarItem: vscode.StatusBarItem): void {
        if (testSoundStatusBarItem) {
            testSoundStatusBarItem.text = '$(unmute) Test Sound';
            testSoundStatusBarItem.tooltip = 'FAAH Terminal Alert: Play a test sound';
        }
    }
    public updateDebugStatusBar(debugStatusBarItem: vscode.StatusBarItem, debugEnabled: boolean): void {
        if (debugStatusBarItem) {
            debugStatusBarItem.text = debugEnabled ? "$(debug-alt) Debug ON" : "$(debug-alt-small) Debug OFF";
            debugStatusBarItem.tooltip = debugEnabled ? "Debug: ON - Click to disable" : "Debug: OFF - Click to enable";
        }
    }
}