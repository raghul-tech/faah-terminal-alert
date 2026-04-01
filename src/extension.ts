import * as vscode from 'vscode';
import { SoundManager } from './soundManager';
import {errorPatterns} from './errorPatterns';

let soundManager: SoundManager;
let outputChannel: vscode.OutputChannel;
let lastPlayed = 0;
let soundEnabled = true;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    // Create output channel for debugging
    outputChannel = vscode.window.createOutputChannel('FAAH Terminal');
    
    // Initialize sound manager
    soundManager = new SoundManager(context, outputChannel);
    
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    updateStatusBar();
    statusBarItem.command = 'faah-terminal.toggle';
    statusBarItem.show();
    
    // Get configuration
    const config = vscode.workspace.getConfiguration('faah-terminal');
    soundEnabled = config.get('enabled', true);
    
    // Register commands
    registerCommands(context);
    
    // Setup terminal monitoring
    setupTerminalMonitoring(context, config);
    
    // Setup text monitoring (fallback)
    setupTextMonitoring(context, config);
    
    // Add to subscriptions for cleanup
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
    // Toggle sound
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
    // Monitor shell execution (primary method)
    if (vscode.window.onDidEndTerminalShellExecution) {
        outputChannel.appendLine('Shell execution monitoring active');
        
        context.subscriptions.push(
            vscode.window.onDidEndTerminalShellExecution(async (e) => {
                if (!soundEnabled) return;
                
                const exitCode = e.exitCode;
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

function setupTextMonitoring(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration): void {
    outputChannel.appendLine('Text pattern monitoring active');
    
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((e) => {
            if (!soundEnabled) return;
            
            if (e.document.uri.scheme === 'vscode-terminal') {
                // Only check last few lines for performance
                const text = e.document.getText();
                const lines = text.split('\n');
                const lastLines = lines.slice(-3).join('\n');
                
                if (errorPatterns.test(lastLines)) {
                    const now = Date.now();
                    const cooldown = config.get<number>('cooldown', 500);
                    
                    if (now - lastPlayed >= cooldown) {
                        lastPlayed = now;
                        outputChannel.appendLine(` Terminal error detected`);
                        soundManager.play().catch(() => {});
                    }
                }
            }
        })
    );
}

export function deactivate() {
    if (soundManager) {
        soundManager.cleanup();
    }
    if (outputChannel) {
        outputChannel.dispose();
    }
}