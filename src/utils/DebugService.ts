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
    }

    public isDebugEnabled(): boolean {
        return this.debugEnabled;
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