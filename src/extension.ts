import * as vscode from 'vscode';
import { SoundManager } from './SoundManager/SoundPlayer';
import { DebugService } from './utils/DebugService';
import { StatusBar } from './utils/StatusBar';

let soundManager: SoundManager;
let outputChannel: vscode.OutputChannel;
let soundEnabled = true;
let statusBar = new StatusBar();
let soundStatusBarItem: vscode.StatusBarItem;
let debugStatusBarItem: vscode.StatusBarItem;
let testSoundStatusBarItem: vscode.StatusBarItem;
const commandToggleSound = 'faah-terminal-alert.toggle';
const commandToggleDebug = 'faah-terminal-alert.debug';
const commandTestSound = 'faah-terminal-alert.testSound';
const debugService = new DebugService();

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('FAAH Terminal Alert');
    debugService.initialize(outputChannel);
    debugService.defaultMessage();

    const config = vscode.workspace.getConfiguration('faah-terminal-alert');
    soundEnabled = config.get('enabled', true);
    debugService.setDebugEnabled(config.get('debugEnabled', false));
    const cooldownMs = config.get<number>('cooldown', 1000);
    soundManager = new SoundManager(context, debugService, cooldownMs);

    soundStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.updateSoundStatusBar(soundStatusBarItem, soundEnabled);
    soundStatusBarItem.command = commandToggleSound;
    soundStatusBarItem.show();

    debugStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    statusBar.updateDebugStatusBar(debugStatusBarItem, debugService.isDebugEnabled());
    debugStatusBarItem.command = commandToggleDebug;
    debugStatusBarItem.show();

    testSoundStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);
    statusBar.updateTestSoundStatusBar(testSoundStatusBarItem);
    testSoundStatusBarItem.command = commandTestSound;
    testSoundStatusBarItem.show();

    registerCommands(context);
    setupTerminalMonitoring(context);

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (!e.affectsConfiguration('faah-terminal-alert')) return;

            const updatedConfig = vscode.workspace.getConfiguration('faah-terminal-alert');
            const updatedEnabled = updatedConfig.get('enabled', true);
            const updatedDebugEnabled = updatedConfig.get('debugEnabled', false);
            const updatedCooldownMs = updatedConfig.get<number>('cooldown', 1000);

            soundEnabled = updatedEnabled;
            statusBar.updateSoundStatusBar(soundStatusBarItem, soundEnabled);

            debugService.setDebugEnabled(updatedDebugEnabled);
            statusBar.updateDebugStatusBar(debugStatusBarItem, updatedDebugEnabled);

            soundManager.setCooldownMs(updatedCooldownMs);
        })
    );

    context.subscriptions.push(soundStatusBarItem);
    context.subscriptions.push(debugStatusBarItem);
    context.subscriptions.push(testSoundStatusBarItem);
    context.subscriptions.push(outputChannel);
    context.subscriptions.push({ dispose: () => soundManager.cleanup() });
}

function registerCommands(context: vscode.ExtensionContext): void {

    context.subscriptions.push(
        vscode.commands.registerCommand(commandToggleSound, async () => {
            const config = vscode.workspace.getConfiguration('faah-terminal-alert');
            soundEnabled = !soundEnabled;
            await config.update('enabled', soundEnabled, vscode.ConfigurationTarget.Global);
            statusBar.updateSoundStatusBar(soundStatusBarItem, soundEnabled);
            debugService.message(`Sound ${soundEnabled ? 'enabled' : 'disabled'}`);
            vscode.window.showInformationMessage(`FAAH terminal alert ${soundEnabled ? 'enabled' : 'disabled'}`);
        })
    );
     context.subscriptions.push(
        vscode.commands.registerCommand(commandToggleDebug, async () => {
            const config = vscode.workspace.getConfiguration('faah-terminal-alert');
            const newState = !debugService.isDebugEnabled();
            debugService.setDebugEnabled(newState);
            await config.update('debugEnabled', newState, vscode.ConfigurationTarget.Global);
            statusBar.updateDebugStatusBar(debugStatusBarItem, newState);
            debugService.message(`Debug mode ${newState ? 'enabled' : 'disabled'}`);
            vscode.window.showInformationMessage(`FAAH terminal alert: Debug mode ${newState ? 'enabled' : 'disabled'}`);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(commandTestSound, async () => {
            if (!soundEnabled) {
                debugService.warn('FAAH terminal alert: sound is currently disabled, but test sound will still be played');
            }
            try {
                const played = await soundManager.testSound();
                if (played) {
                    debugService.success('FAAH terminal alert: test sound played successfully');
                } else {
                    debugService.warn('FAAH terminal alert: test sound was skipped or could not be played');
                }
            } catch (err) {
                debugService.error(`FAAH terminal alert: test sound failed: ${err instanceof Error ? err.message : String(err)}`);
            }
            vscode.window.showInformationMessage('FAAH terminal alert: test sound requested');
        })
    );
    
}

function setupTerminalMonitoring(context: vscode.ExtensionContext): void {
    if (vscode.window.onDidEndTerminalShellExecution) {
        debugService.debug('Terminal monitoring: onDidEndTerminalShellExecution listener registered');

        context.subscriptions.push(
            vscode.window.onDidEndTerminalShellExecution(async (e) => {
                if (!soundEnabled) {
                    debugService.debug(`Terminal monitoring: sound is disabled. ignoring terminal exit event in terminal ${e.terminal.name}`);
                    return;
                }
                const exitCode = e.exitCode;
                debugService.debug(`Terminal monitoring: shell execution ended. exitCode=${exitCode} in terminal ${e.terminal.name}`);
                if (exitCode === undefined) {
                    debugService.error(`Terminal monitoring: exitCode is undefined; nothing to do in terminal ${e.terminal.name}`);
                    return;
                }
                if (exitCode !== 0) {
                    debugService.debug(`Terminal command failed with exit code ${exitCode}. Attempting to play alert sound in terminal ${e.terminal.name}`);
                    soundManager.play()
                        .then((played) => {
                            if (played) {
                                debugService.success(`FAAH terminal alert: sound played successfully in terminal ${e.terminal.name}`);
                            } else {
                                debugService.debug(`FAAH terminal alert: sound skipped due to cooldown in terminal ${e.terminal.name}`);
                            }
                        })
                        .catch((err) => {
                            debugService.error(`Failed to play alert sound in terminal ${e.terminal.name}: ${err instanceof Error ? err.message : String(err)}`);
                        });
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