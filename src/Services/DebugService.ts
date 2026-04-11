import * as vscode from 'vscode';

export class DebugService {
    private static instance: DebugService;
    private outputChannel: vscode.OutputChannel | null = null;
    private debugEnabled: boolean = false;
    
    private getTimestamp(): string {
        return new Date().toISOString();
    }
    
    public initialize(outputChannel: vscode.OutputChannel): void {
        this.outputChannel = outputChannel;
    }

    public setDebugEnabled(enabled: boolean): void {
        this.debugEnabled = enabled;
        this.debug(`Debug enabled updated to ${enabled}`);
    }

    public isDebugEnabled(): boolean {
        return this.debugEnabled;
    }

    public defaultMessage(): void {
        this.message('FAAH Terminal Alert activated');
        this.message(process.platform === 'darwin'
            ? 'Sound: shortcut hint: cmd+alt+f to toggle sound'
            : 'Sound: shortcut hint: ctrl+alt+f to toggle sound');
        this.message(process.platform === 'darwin'
            ? 'Debug: shortcut hint: cmd+alt+d to toggle debug'
            : 'Debug: shortcut hint: ctrl+alt+d to toggle debug');
        this.message(process.platform === 'darwin'
            ? 'Test Sound: shortcut hint: cmd+alt+t to test sound'
            : 'Test Sound: shortcut hint: ctrl+alt+t to test sound');
    }

    public message(message: string): void {
        if (this.outputChannel) {
            this.outputChannel.appendLine(`[${this.getTimestamp()}] (MESSAGE) ${message}`);
        }
    }
    public debug(message: string): void {
        if (this.debugEnabled && this.outputChannel) {
            this.outputChannel.appendLine(`[${this.getTimestamp()}] (DEBUG) ${message}`);
        }
    }
    public error(message: string): void {
        if (this.debugEnabled && this.outputChannel) {
            this.outputChannel.appendLine(`[${this.getTimestamp()}] (ERROR) ${message}`);
        }
    }
    public warn(message: string): void {
        if (this.debugEnabled && this.outputChannel) {
            this.outputChannel.appendLine(`[${this.getTimestamp()}] (WARNING) ${message}`);
        }
    }
    public success(message: string): void {
        if (this.debugEnabled && this.outputChannel) {
            this.outputChannel.appendLine(`[${this.getTimestamp()}] (SUCCESS) ${message}`);
        }
    }
}