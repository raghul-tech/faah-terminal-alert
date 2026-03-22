import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec, spawn } from 'child_process';

// Use require for play-sound as it doesn't have great TypeScript support
const player = require('play-sound')({
    players: ['powershell', 'afplay', 'aplay', 'mpg123', 'mpg321', 'play', 'omxplayer', 'cvlc', 'vlc', 'wmic']
});

interface QuietHours {
    enabled: boolean;
    start: string;
    end: string;
}

class SoundManager {
    private context: vscode.ExtensionContext;
    private outputChannel: vscode.OutputChannel;
    private soundFile: string = "";
    private platform: string;

    constructor(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
        this.context = context;
        this.outputChannel = outputChannel;
        this.platform = process.platform;
        this.initialize();
    }

    private initialize(): void {
        this.findSoundFile();
        
        if (this.soundFile) {
            this.outputChannel.appendLine(`Sound file found: ${path.basename(this.soundFile)}`);
        } else {
            this.outputChannel.appendLine('No sound file found!');
            this.outputChannel.appendLine(`Extension path: ${this.context.extensionPath}`);
            
            // List all files in extension root for debugging
            try {
                const files = fs.readdirSync(this.context.extensionPath);
                this.outputChannel.appendLine(`Files in root: ${files.join(', ')}`);
                
                // Check if media folder exists
                const mediaPath = path.join(this.context.extensionPath, 'media');
                if (fs.existsSync(mediaPath)) {
                    const mediaFiles = fs.readdirSync(mediaPath);
                    this.outputChannel.appendLine(`Media folder files: ${mediaFiles.join(', ')}`);
                }
            } catch (e) {
                this.outputChannel.appendLine(`Error reading directory: ${e}`);
            }
        }
    }

    private findSoundFile(): void {
        // Check all possible locations
        const possiblePaths = [
            path.join(this.context.extensionPath, 'media', 'faah.wav'),
            path.join(this.context.extensionPath, 'faah.wav'),
            path.join(this.context.extensionUri.fsPath, 'media', 'faah.wav'),
            path.join(__dirname, '..', 'media', 'faah.wav'),
            path.join(__dirname, 'media', 'faah.wav'),
            path.join(__dirname, '..', '..', 'media', 'faah.wav')
        ];

        for (const filePath of possiblePaths) {
            try {
                if (filePath && fs.existsSync(filePath)) {
                    this.soundFile = filePath;
                    break;
                }
            } catch (e) {
                // Ignore errors for path checks
            }
        }
    }

    public async play(): Promise<boolean> {
        if (!this.soundFile) {
            this.findSoundFile();
            if (!this.soundFile) {
                return this.systemBeep();
            }
        }

        this.outputChannel.appendLine(`Attempting to play: ${path.basename(this.soundFile)}`);

        // Try play-sound first (simplest)
        return new Promise((resolve) => {
            player.play(this.soundFile, (err: any) => {
                if (err) {
                    this.outputChannel.appendLine('play-sound failed: ${err.message || err}');
                    // Fall back to direct methods
                    this.playWithFallback().then(resolve);
                } else {
                    this.outputChannel.appendLine('Sound played successfully');
                    resolve(true);
                }
            });
        });
    }

    private async playWithFallback(): Promise<boolean> {
        this.outputChannel.appendLine("Trying fallback methods...");
        
        // Try multiple methods in order
        const methods = [
            this.playWithPowerShell.bind(this),
            this.playWithSystemSound.bind(this),
            this.playWithBeep.bind(this)
        ];

        for (const method of methods) {
            try {
                const result = await method();
                if (result) {
                    return true;
                }
            } catch (error) {
                this.outputChannel.appendLine(`Method failed: ${error}`);
            }
        }

        return false;
    }

    private async playWithPowerShell(): Promise<boolean> {
        return new Promise((resolve) => {
            this.outputChannel.appendLine("Method: PowerShell SoundPlayer");
            
            const command = `powershell -Command "(New-Object Media.SoundPlayer '${this.soundFile}').PlaySync();"`;
            
            exec(command, { windowsHide: true }, (error) => {
                if (error) {
                    this.outputChannel.appendLine(`PowerShell failed: ${error.message}`);
                    resolve(false);
                } else {
                    this.outputChannel.appendLine(`PowerShell playback successful`);
                    resolve(true);
                }
            });
        });
    }

    private async playWithSystemSound(): Promise<boolean> {
        return new Promise((resolve) => {
            this.outputChannel.appendLine("Method: System Sounds");
            
            // Try different system sounds
            const sounds = ['Asterisk', 'Beep', 'Exclamation', 'Hand'];
            
            const trySound = (index: number) => {
                if (index >= sounds.length) {
                    resolve(false);
                    return;
                }
                
                const command = `powershell -c "[System.Media.SystemSounds]::${sounds[index]}.Play();"`;
                exec(command, { windowsHide: true }, (error) => {
                    if (!error) {
                        this.outputChannel.appendLine(`System sound ${sounds[index]} played`);
                        resolve(true);
                    } else {
                        trySound(index + 1);
                    }
                });
            };
            
            trySound(0);
        });
    }

    private async playWithBeep(): Promise<boolean> {
        return this.systemBeep();
    }

    private async systemBeep(): Promise<boolean> {
        this.outputChannel.appendLine("Using system beep");
        
        if (this.platform === 'win32') {
            exec('powershell -c "[Console]::Beep(800,200)"', { windowsHide: true });
            exec('powershell -c "[Console]::Beep(600,100)"', { windowsHide: true });
        } else {
            process.stdout.write('\x07');
        }
        return true;
    }

    public dispose(): void {
        // Nothing to dispose
    }
}

export function activate(context: vscode.ExtensionContext) {
    // Create output channel for debugging
    const outputChannel = vscode.window.createOutputChannel('FAAH Terminal');
    outputChannel.appendLine('FAAH Terminal extension activated');
    outputChannel.appendLine(`Extension path: ${context.extensionPath}`);
    outputChannel.appendLine(`Extension URI: ${context.extensionUri.toString()}`);
    outputChannel.appendLine(`__dirname: ${__dirname}`);
    
    // Initialize sound manager
    const soundManager = new SoundManager(context, outputChannel);
    
    let lastPlayed = 0;
    let soundEnabled = true;
    
    // Status bar item for toggling
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(bell) FAAH";
    statusBarItem.tooltip = "FAAH Terminal Sound - Click to toggle";
    statusBarItem.command = 'faah-terminal.toggle';
    statusBarItem.show();
    
    const config = vscode.workspace.getConfiguration('faah-terminal');
    soundEnabled = config.get('enabled', true);
    
    // Register toggle command
    context.subscriptions.push(
        vscode.commands.registerCommand('faah-terminal.toggle', () => {
            soundEnabled = !soundEnabled;
            statusBarItem.text = soundEnabled ? "$(bell) FAAH" : "$(bell-slash) FAAH";
            vscode.window.showInformationMessage(`FAAH sound ${soundEnabled ? 'enabled' : 'disabled'}`);
            outputChannel.appendLine(`Sound toggled: ${soundEnabled}`);
        })
    );

    // Register test command
    context.subscriptions.push(
        vscode.commands.registerCommand('faah-terminal.testSound', async () => {
            outputChannel.appendLine('Testing sound...');
            const start = Date.now();
            const result = await soundManager.play();
            const end = Date.now();
            if (result) {
                vscode.window.showInformationMessage(`Sound test successful! (${end - start}ms)`);
                outputChannel.appendLine(`Sound test successful (${end - start}ms)`);
            } else {
                vscode.window.showErrorMessage(' Sound test failed');
                outputChannel.appendLine('Sound test failed');
            }
        })
    );
    
    // Monitor shell integration
    function setupShellIntegration() {
        try {
            // Check if the API exists
            if (vscode.window.onDidEndTerminalShellExecution) {
                outputChannel.appendLine('Setting up shell integration monitoring...');
                
                context.subscriptions.push(
                    vscode.window.onDidEndTerminalShellExecution(async (e) => {
                        if (!soundEnabled) return;
                        
                        const exitCode = e.exitCode;
                        
                        if (exitCode !== 0 && exitCode !== undefined) {
                            outputChannel.appendLine(` Command failed with exit code ${exitCode}`);
                            
                            const now = Date.now();
                            const cooldown = config.get<number>('cooldown', 1000);
                            
                            if (now - lastPlayed >= cooldown) {
                                lastPlayed = now;
                                outputChannel.appendLine(` Playing sound for command failure`);
                                soundManager.play().catch(() => {});
                            }
                        }
                    })
                );
                
                outputChannel.appendLine('Shell integration active');
            } else {
                outputChannel.appendLine('Shell integration not available in this VS Code version');
            }
        } catch (error) {
            outputChannel.appendLine(`Shell integration error: ${error}`);
        }
    }
    
    // Monitor terminal text changes
    function setupTextDocumentMonitoring() {
        try {
            outputChannel.appendLine('Setting up text document monitoring...');
            
            context.subscriptions.push(
                vscode.workspace.onDidChangeTextDocument((e) => {
                    if (!soundEnabled) return;
                    
                    if (e.document.uri.scheme === 'vscode-terminal') {
                        for (const change of e.contentChanges) {
                            if (change.text && change.text.length > 0) {
                                const text = change.text.toLowerCase();
                                
                                // Quick check for common error patterns
                                if (text.includes('not recognized') ||
                                    text.includes('command not found') ||
                                    text.includes('error') ||
                                    text.includes('failed') ||
                                    text.includes('cannot') ||
                                    text.includes('fatal') ||
                                    text.includes('exception')) {
                                    
                                    outputChannel.appendLine(`Terminal error detected`);
                                    
                                    const now = Date.now();
                                    const cooldown = config.get<number>('cooldown', 1000);
                                    
                                    if (now - lastPlayed >= cooldown) {
                                        lastPlayed = now;
                                        outputChannel.appendLine(`Playing sound for terminal error`);
                                        soundManager.play().catch(() => {});
                                    }
                                }
                            }
                        }
                    }
                })
            );
            
            outputChannel.appendLine('Text document monitoring active');
        } catch (error) {
            outputChannel.appendLine(` Error setting up text monitoring: ${error}`);
        }
    }
    
    // Setup monitoring
    outputChannel.appendLine(' Setting up monitoring methods...');
    setupShellIntegration();
    setupTextDocumentMonitoring();
    
    // Monitor terminal creation
    context.subscriptions.push(
        vscode.window.onDidOpenTerminal(terminal => {
            outputChannel.appendLine(`New terminal opened: "${terminal.name || 'unnamed'}"`);
        })
    );
    
    // Quick sound test on startup
    setTimeout(async () => {
        outputChannel.appendLine(' Testing sound...');
        const start = Date.now();
        await soundManager.play();
        const end = Date.now();
        outputChannel.appendLine(`Sound test completed in ${end - start}ms`);
    }, 1000);
    
    // Status
    setTimeout(() => {
        outputChannel.appendLine('');
        outputChannel.appendLine(' Monitoring active - waiting for terminal errors...');
        outputChannel.appendLine('Try typing an invalid command like "asdf" and press Enter');
        outputChannel.appendLine('Check the output channel for debug messages');
    }, 2000);

    statusBarItem.text = soundEnabled ? "$(bell) FAAH" : "$(bell-slash) FAAH";
    
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(outputChannel);
    context.subscriptions.push({ dispose: () => soundManager.dispose() });
    
    outputChannel.appendLine(' FAAH Terminal initialization complete');
}

export function deactivate() {}