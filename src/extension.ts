import * as vscode from 'vscode';
import { SoundManager } from './SoundManager/faahSoundManager';

let soundManager: SoundManager;
let outputChannel: vscode.OutputChannel;
let lastPlayed = 0;
let soundEnabled = true;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('FAAH Terminal');
    
    soundManager = new SoundManager(context, outputChannel);
    
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    updateStatusBar();
    statusBarItem.command = 'faah-terminal.toggle';
    statusBarItem.show();
    
    const config = vscode.workspace.getConfiguration('faah-terminal');
    soundEnabled = config.get('enabled', true);
    
    registerCommands(context);
    setupTerminalMonitoring(context, config);
    
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(outputChannel);
    context.subscriptions.push({ dispose: () => soundManager.cleanup() });
    
}

function updateStatusBar(): void {
    if (statusBarItem) {
        statusBarItem.text = soundEnabled ? "$(bell) FAAH" : "$(bell-slash) FAAH";
        statusBarItem.tooltip = soundEnabled ? "FAAH Sound: Enabled" : "FAAH Sound: Disabled";
    }
}

function registerCommands(context: vscode.ExtensionContext): void {

    context.subscriptions.push(
        vscode.commands.registerCommand('faah-terminal.toggle', () => {
            soundEnabled = !soundEnabled;
            updateStatusBar();
            outputChannel.appendLine(`Sound ${soundEnabled ? 'enabled' : 'disabled'}`);
            vscode.window.showInformationMessage(`FAAH sound ${soundEnabled ? 'enabled' : 'disabled'}`);
        })
    );
    
}

function setupTerminalMonitoring(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration): void {
    if (vscode.window.onDidEndTerminalShellExecution) {
        outputChannel.appendLine('Shell execution monitoring active');
        
        context.subscriptions.push(
            vscode.window.onDidEndTerminalShellExecution(async (e) => {
                if (!soundEnabled) return;
                
                const exitCode = e.exitCode;
                outputChannel.appendLine(`Shell execution ended with exit code: ${exitCode}`);
                if (exitCode !== 0 && exitCode !== undefined) {
                    const now = Date.now();
                    const cooldown = config.get<number>('cooldown', 500);
                
                    if (now - lastPlayed >= cooldown) {
                        lastPlayed = now;
                        outputChannel.appendLine(`Command failed (exit: ${exitCode})`);
                        soundManager.play().catch(() => {});
                    }
                }
            })
        );
    } else {
        outputChannel.appendLine(' Shell execution monitoring not available');
    }
}

export function deactivate() {
    if (soundManager) {
        soundManager.cleanup();
    }
    if (outputChannel) {
        outputChannel.dispose();
    }
}