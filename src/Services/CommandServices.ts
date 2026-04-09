import { DebugService } from "./DebugService";
import * as vscode from 'vscode';
import { StatusBar } from "../utils/StatusBar";
import { SoundManager } from "../SoundManager/SoundPlayer";


export const ToggleSoundName = 'faah-terminal-alert.toggle';
export const ToggleDebugName = 'faah-terminal-alert.debug';
export const TestSoundName = 'faah-terminal-alert.testSound';

export class CommandServices{
    private debugService: DebugService;
    private statusBar: StatusBar;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext,debugService: DebugService, statusBar: StatusBar) {
        this.context = context;
        this.debugService = debugService;
        this.statusBar = statusBar;
    }

    public commandSoundToggle(soundEnabled: boolean,soundStatusBarItem:vscode.StatusBarItem ){
              this.context.subscriptions.push(
                    vscode.commands.registerCommand(ToggleSoundName, async () => {
                        const config = vscode.workspace.getConfiguration('faah-terminal-alert');
                        soundEnabled = !soundEnabled;
                        await config.update('enabled', soundEnabled, vscode.ConfigurationTarget.Global);
                        this.statusBar.updateSoundStatusBar(soundStatusBarItem, soundEnabled);
                        this.debugService.message(`Sound ${soundEnabled ? 'enabled' : 'disabled'}`);
                        vscode.window.showInformationMessage(`FAAH terminal alert: ${soundEnabled ? 'enabled' : 'disabled'}`);
                    })
                );
    }

    public commandDebugToggle(debugStatusBarItem:vscode.StatusBarItem){
          this.context.subscriptions.push(
                vscode.commands.registerCommand(ToggleDebugName, async () => {
                    const config = vscode.workspace.getConfiguration('faah-terminal-alert');
                    const newState = !this.debugService.isDebugEnabled();
                    this.debugService.setDebugEnabled(newState);
                    await config.update('debugEnabled', newState, vscode.ConfigurationTarget.Global);
                    this.statusBar.updateDebugStatusBar(debugStatusBarItem, newState);
                    this.debugService.message(`Debug mode ${newState ? 'enabled' : 'disabled'}`);
                    vscode.window.showInformationMessage(`FAAH terminal alert: Debug mode ${newState ? 'enabled' : 'disabled'}`);
                })
            );
    }

    public commandTestSound(soundEnabled:boolean, soundManager:SoundManager){
        this.context.subscriptions.push(
            vscode.commands.registerCommand(TestSoundName, async () => {
                if (!soundEnabled) {
                    this.debugService.warn('FAAH terminal alert: sound is currently disabled, but test sound will still be played');
                }
                try {
                    const played = await soundManager.testSound();
                    if (played) {
                        this.debugService.success('FAAH terminal alert: test sound played successfully');
                    } else {
                        this.debugService.warn('FAAH terminal alert: test sound was skipped or could not be played');
                    }
                } catch (err) {
                    this.debugService.error(`FAAH terminal alert: test sound failed: ${err instanceof Error ? err.message : String(err)}`);
                }
                vscode.window.showInformationMessage(`FAAH terminal alert: Test Sound Played`);
            })
        );
    }

}