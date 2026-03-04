import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

interface QuietHours {
    enabled: boolean;
    start: string;
    end: string;
}

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('FAAH Terminal');
    outputChannel.appendLine('FAAH Terminal extension activated');

    let lastPlayed = 0;
    let soundEnabled = true;
    let terminalContent = '';
    let diagnosticCollection: vscode.DiagnosticCollection;
    
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(bell) FAAH";
    statusBarItem.tooltip = "FAAH Terminal Sound - Click to toggle";
    statusBarItem.command = 'faah-terminal.toggle';
    statusBarItem.show();
    
    const config = vscode.workspace.getConfiguration('faah-terminal');
    soundEnabled = config.get('enabled', true);
    
    context.subscriptions.push(
        vscode.commands.registerCommand('faah-terminal.toggle', () => {
            soundEnabled = !soundEnabled;
            statusBarItem.text = soundEnabled ? "$(bell) FAAH" : "$(bell-slash) FAAH";
            vscode.window.showInformationMessage(`FAAH sound ${soundEnabled ? 'enabled' : 'disabled'}`);
            outputChannel.appendLine(`Sound toggled: ${soundEnabled}`);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('faah-terminal.testSound', async () => {
            outputChannel.appendLine('Testing sound...');
            await playSound(context, outputChannel);
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('faah-terminal.selectSound', async () => {
            const options: vscode.OpenDialogOptions = {
                canSelectMany: false,
                openLabel: 'Select Sound File',
                filters: {
                    'Audio Files': ['mp3', 'wav', 'm4a']
                }
            };
            
            const fileUri = await vscode.window.showOpenDialog(options);
            if (fileUri && fileUri[0]) {
                await config.update('customSoundPath', fileUri[0].fsPath, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(`Sound file set to: ${fileUri[0].fsPath}`);
                outputChannel.appendLine(`Custom sound set: ${fileUri[0].fsPath}`);
            }
        })
    );
    
    context.subscriptions.push(
        vscode.tasks.onDidEndTaskProcess(async (e) => {
            if (!soundEnabled || !config.get('monitorTerminal', true)){ return;}
            
            outputChannel.appendLine(`Task ended with exit code: ${e.exitCode}`);
            
            if (e.exitCode !== undefined && e.exitCode !== 0) {
                if (await shouldPlaySound()) {
                    await playSound(context, outputChannel);
                }
            }
        })
    );
    
    context.subscriptions.push(
        vscode.window.onDidChangeTerminalShellIntegration(async (e) => {
            if (!soundEnabled || !config.get('monitorTerminal', true)) {return;}
            
            const terminal = vscode.window.activeTerminal;
            if (terminal) {
                outputChannel.appendLine('Terminal shell integration changed');
            }
        })
    );
    
    vscode.workspace.onDidChangeTextDocument(async (e) => {
        if (!soundEnabled || !config.get('monitorTerminal', true)){ return;}
        
        if (e.document.uri.scheme === 'vscode-terminal') {
            const text = e.document.getText();
            const lastLine = text.split('\n').pop() || '';
            
            const patterns = config.get<string[]>('errorPatterns', ['error', 'failed']);
            
            for (const pattern of patterns) {
                const regex = new RegExp(pattern, 'i');
                if (regex.test(lastLine)) {
                    outputChannel.appendLine(`Terminal error pattern matched: "${pattern}" in "${lastLine}"`);
                    if (await shouldPlaySound()) {
                        await playSound(context, outputChannel);
                    }
                    break;
                }
            }
        }
    });
    
    diagnosticCollection = vscode.languages.createDiagnosticCollection('faah-terminal');
    context.subscriptions.push(diagnosticCollection);
    
    context.subscriptions.push(
        vscode.languages.onDidChangeDiagnostics(async (e) => {
            if (!soundEnabled || !config.get('monitorDiagnostics', true)){ return; }
            
            const includeWarnings = config.get('includeWarnings', false);
            
            for (const uri of e.uris) {
                const diagnostics = vscode.languages.getDiagnostics(uri);
                const errors = diagnostics.filter(d => 
                    d.severity === vscode.DiagnosticSeverity.Error || 
                    (includeWarnings && d.severity === vscode.DiagnosticSeverity.Warning)
                );
                
                if (errors.length > 0) {
                    outputChannel.appendLine(`Found ${errors.length} errors/warnings in ${uri.fsPath}`);
                    if (await shouldPlaySound()) {
                        await playSound(context, outputChannel);
                    }
                    break;
                }
            }
        })
    );
    
    async function shouldPlaySound(): Promise<boolean> {
        const config = vscode.workspace.getConfiguration('faah-terminal');
        
        const now = Date.now();
        const cooldown = config.get<number>('cooldown', 3000);
        if (now - lastPlayed < cooldown) {
            outputChannel.appendLine('Cooldown active, skipping');
            return false;
        }
        
        const quietHours = config.get<QuietHours>('quietHours', { enabled: false, start: '22:00', end: '08:00' });
        if (quietHours.enabled) {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            if (currentTime >= quietHours.start || currentTime < quietHours.end) {
                outputChannel.appendLine('Quiet hours active, skipping');
                return false;
            }
        }
        
        lastPlayed = now;
        return true;
    }
    
    async function playSound(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel): Promise<void> {
        const config = vscode.workspace.getConfiguration('faah-terminal');
        const customPath = config.get<string>('customSoundPath', '');
        
        let soundFile: string | null = null;
    
        if (customPath && fs.existsSync(customPath)) {
            soundFile = customPath;
            outputChannel.appendLine(`Using custom sound: ${customPath}`);
        } else {
            const defaultMp3 = path.join(context.extensionPath, 'media', 'faah.mp3');
            const defaultWav = path.join(context.extensionPath, 'media', 'faah.wav');
            
            if (fs.existsSync(defaultWav)) {
                soundFile = defaultWav;
            } else if (fs.existsSync(defaultMp3)) {
                soundFile = defaultMp3;
            }
        }
        
        if (!soundFile) {
            outputChannel.appendLine('No sound file found');
            if (process.platform === 'win32') {
                exec('powershell -c [Console]::Beep(500,300)');
            } else {
                process.stdout.write('\x07');
            }
            return;
        }
        
        const platform = process.platform;
        outputChannel.appendLine(`Playing sound on ${platform}: ${soundFile}`);
        
        try {
            if (platform === 'win32') {
                const methods = [
                    `powershell -WindowStyle Hidden -Command "(New-Object Media.SoundPlayer '${soundFile}').PlaySync();"`,
                    `powershell -c [Console]::Beep(500,300)`
                ];
            
                exec(methods[0], { windowsHide: true }, (error) => {
                    if (error) {
                        outputChannel.appendLine(`Primary sound method failed: ${error.message}`);
                        exec(methods[1]);
                    }
                });
            } 
            else if (platform === 'darwin') {
                exec(`afplay "${soundFile}"`, (error) => {
                    if (error) {
                        outputChannel.appendLine(`macOS sound failed: ${error.message}`);
                        process.stdout.write('\x07');
                    }
                });
            } 
            else {
                exec(`aplay "${soundFile}" 2>/dev/null || play "${soundFile}" 2>/dev/null`, (error) => {
                    if (error) {
                        outputChannel.appendLine(`Linux sound failed: ${error.message}`);
                        process.stdout.write('\x07');
                    }
                });
            }
        } catch (error) {
            outputChannel.appendLine(`Sound playback error: ${error}`);
            process.stdout.write('\x07');
        }
    }

    statusBarItem.text = soundEnabled ? "$(bell) FAAH" : "$(bell-slash) FAAH";
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(outputChannel);
}

export function deactivate() {}