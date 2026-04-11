import * as vscode from 'vscode';
import { SoundManager } from './SoundManager/SoundPlayer';
import { DebugService } from './Services/DebugService';
import { StatusBar } from './StatusBar';
import { CommandServices, ToggleSoundName, ToggleDebugName, TestSoundName } from './Services/CommandServices';
import { ChangeConfigService } from './Services/ChangeConfigServices';
import { MonitoringService } from './Services/MonitoringService';

let soundManager: SoundManager;
let outputChannel: vscode.OutputChannel;
let soundEnabled = true;
let soundStatusBarItem: vscode.StatusBarItem;
let debugStatusBarItem: vscode.StatusBarItem;
let testSoundStatusBarItem: vscode.StatusBarItem;
let monitoringService : MonitoringService;
let commandService :CommandServices;
let changeConfigService: ChangeConfigService;
const debugService = new DebugService();
const statusBar = new StatusBar();

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
    soundStatusBarItem.command = ToggleSoundName;
    soundStatusBarItem.show();

    debugStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    statusBar.updateDebugStatusBar(debugStatusBarItem, debugService.isDebugEnabled());
    debugStatusBarItem.command = ToggleDebugName;
    debugStatusBarItem.show();

    testSoundStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);
    statusBar.updateTestSoundStatusBar(testSoundStatusBarItem);
    testSoundStatusBarItem.command = TestSoundName;
    testSoundStatusBarItem.show();

    commandService = new CommandServices(context, debugService, statusBar);
    commandService.commandSoundToggle(soundEnabled,soundStatusBarItem);
    commandService.commandDebugToggle(debugStatusBarItem);
    commandService.commandTestSound(soundEnabled, soundManager);

    monitoringService = new MonitoringService(context,debugService);
    monitoringService.setupTerminalMonitoring(soundEnabled,soundManager);

    changeConfigService = new ChangeConfigService(context,debugService,statusBar,soundEnabled);
    changeConfigService.commandChangeConfiguration(soundStatusBarItem,debugStatusBarItem,soundManager);
    soundEnabled = changeConfigService.getSoundEnabled();
 
    context.subscriptions.push(soundStatusBarItem);
    context.subscriptions.push(debugStatusBarItem);
    context.subscriptions.push(testSoundStatusBarItem);
    context.subscriptions.push(outputChannel);
    context.subscriptions.push({ dispose: () => soundManager.cleanup() });
}

export function deactivate() {
    if (soundManager) {
        soundManager.cleanup();
    }
    if (outputChannel) {
        outputChannel.dispose();
    }
}