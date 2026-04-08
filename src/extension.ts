import * as vscode from 'vscode';
import { SoundManager } from './SoundManager/SoundPlayer';
import { DebugService } from './utils/DebugService';
import { StatusBar } from './utils/StatusBar';

let soundManager: SoundManager;
let outputChannel: vscode.OutputChannel;
let lastPlayed = 0;
let soundEnabled = true;
let statusBar = new StatusBar();
let soundStatusBarItem: vscode.StatusBarItem;
let debugStatusBarItem: vscode.StatusBarItem;
const commandToggleSound = 'faah-terminal-alert.toggle';
const commandToggleDebug = 'faah-terminal-alert.debug';
const debugService = new DebugService();

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('FAAH Terminal Alert');
    debugService.initialize(outputChannel);
    debugService.message('FAAH Terminal Alert activated');
    debugService.message(process.platform === 'darwin'
            ? 'Sound: shortcut hint: cmd+alt+f to toggle sound'
            : 'Sound: shortcut hint: ctrl+alt+f to toggle sound');
    debugService.message(process.platform === 'darwin'
        ? 'Debug: shortcut hint: cmd+alt+d to toggle debug'
        : 'Debug: shortcut hint: ctrl+alt+d to toggle debug');
    soundManager = new SoundManager(context, debugService);
    
    soundStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.updateSoundStatusBar(soundStatusBarItem, soundEnabled);
    soundStatusBarItem.command = commandToggleSound;
    soundStatusBarItem.show();

    debugStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    statusBar.updateDebugStatusBar(debugStatusBarItem, debugService.isDebugEnabled());
    debugStatusBarItem.command = commandToggleDebug;
    debugStatusBarItem.show();
    
    const config = vscode.workspace.getConfiguration('faah-terminal-alert');
    soundEnabled = config.get('enabled', true);
    
    registerCommands(context);
    setupTerminalMonitoring(context, config);
    
    context.subscriptions.push(soundStatusBarItem);
    context.subscriptions.push(debugStatusBarItem);
    context.subscriptions.push(outputChannel);
    context.subscriptions.push({ dispose: () => soundManager.cleanup() });
    
}

function registerCommands(context: vscode.ExtensionContext): void {

    context.subscriptions.push(
        vscode.commands.registerCommand(commandToggleSound, () => {
            soundEnabled = !soundEnabled;
            statusBar.updateSoundStatusBar(soundStatusBarItem, soundEnabled);
            debugService.message(`Sound ${soundEnabled ? 'enabled' : 'disabled'}`);
            vscode.window.showInformationMessage(`FAAH terminal alert ${soundEnabled ? 'enabled' : 'disabled'}`);
        })
    );
     context.subscriptions.push(
        vscode.commands.registerCommand(commandToggleDebug, () => {
            const newState = !debugService.isDebugEnabled();
            debugService.setDebugEnabled(newState);
            statusBar.updateDebugStatusBar(debugStatusBarItem, newState);
            debugService.message(`Debug mode ${newState ? 'enabled' : 'disabled'}`);
            vscode.window.showInformationMessage(`FAAH terminal alert: Debug mode ${newState ? 'enabled' : 'disabled'}`);
        })
    );
    
}

function setupTerminalMonitoring(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration): void {
    if (vscode.window.onDidEndTerminalShellExecution) {
        debugService.debug('Terminal monitoring: onDidEndTerminalShellExecution listener registered');
        
        context.subscriptions.push(
            vscode.window.onDidEndTerminalShellExecution(async (e) => {
                if (!soundEnabled) {
                    debugService.debug(`Terminal monitoring: sound is disabled; ignoring terminal exit event in terminal ${e.terminal.name}`);
                    return;
                }
                const exitCode = e.exitCode;
                debugService.debug(`Terminal monitoring: shell execution ended (exitCode=${exitCode}) in terminal ${e.terminal.name}`);
                if (exitCode === undefined) {
                    debugService.error(`Terminal monitoring: exitCode is undefined; nothing to do in terminal ${e.terminal.name}`);
                    return;
                }
                if (exitCode !== 0) {
                    const now = Date.now();
                    const cooldown = config.get<number>('cooldown', 1000);
                
                    const elapsed = now - lastPlayed;
                    if (elapsed >= cooldown) {
                        lastPlayed = now;
                        debugService.debug(`Terminal command failed (exitCode=${exitCode}); playing alert sound in terminal ${e.terminal.name}`);
                        soundManager.play()
                            .then(() => {
                                debugService.success(`FAAH terminal alert: sound played successfully in terminal ${e.terminal.name}`);
                            })
                            .catch((err) => {
                                debugService.error(`Failed to play alert sound in terminal ${e.terminal.name}: ${err instanceof Error ? err.message : String(err)}`);
                            });
                    } else {
                        debugService.warn(`Terminal command failed (exitCode=${exitCode}) but alert is in cooldown (${elapsed}ms/${cooldown}ms); skipping sound in terminal ${e.terminal.name}`);
                    }
                }
            })
        );
    } else {
        debugService.error('Terminal monitoring: onDidEndTerminalShellExecution API not available in this VS Code version');
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