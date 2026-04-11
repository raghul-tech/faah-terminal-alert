import * as assert from 'assert';
import * as vscode from 'vscode';

suite('FAAH Terminal Alert Extension Tests', () => {
    let extension: vscode.Extension<any> | undefined;
    
    suiteSetup(async () => {
        console.log('=== Starting FAAH Terminal Alert Tests ===');
        extension = vscode.extensions.getExtension('raghul-tech.faah-terminal-alert');
        
        if (!extension) {
            assert.fail('Extension not found. Make sure extension is installed.');
        }
        
        // Activate extension if not already active
        if (!extension.isActive) {
            await extension.activate();
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
    });
    
    suiteTeardown(() => {
        console.log('=== FAAH Terminal Alert Tests Complete ===');
    });
    
    test('Extension should activate successfully', async () => {
        assert.ok(extension, 'Extension should be available');
        assert.ok(extension?.isActive, 'Extension should be active');
        console.log('✓ Extension activation test passed');
    });
    
    test('Commands should be registered', async () => {
        const commands = await vscode.commands.getCommands();
        
        const expectedCommands = [
            'faah-terminal-alert.toggle',
            'faah-terminal-alert.debug',
            'faah-terminal-alert.testSound'
        ];
        
        for (const cmd of expectedCommands) {
            assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`);
        }
        
        console.log('✓ Command registration test passed');
    });
    
    test('Configuration should have default values', async () => {
        const config = vscode.workspace.getConfiguration('faah-terminal-alert');
        
        assert.strictEqual(config.get('enabled'), true, 'Sound should be enabled by default');
        assert.strictEqual(config.get('debugEnabled'), false, 'Debug should be disabled by default');
        assert.strictEqual(config.get('cooldown'), 1000, 'Cooldown should be 1000ms by default');
        
        console.log('✓ Configuration test passed');
    });
    
    test('Toggle sound command should work', async () => {
        const config = vscode.workspace.getConfiguration('faah-terminal-alert');
        const originalState = config.get('enabled');
        
        await vscode.commands.executeCommand('faah-terminal-alert.toggle');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const newState = vscode.workspace.getConfiguration('faah-terminal-alert').get('enabled');
        assert.notStrictEqual(originalState, newState, 'Sound state should be toggled');
        
        // Restore original state
        await vscode.commands.executeCommand('faah-terminal-alert.toggle');
        console.log('✓ Toggle sound test passed');
    });
    
    test('Toggle debug command should work', async () => {
        const config = vscode.workspace.getConfiguration('faah-terminal-alert');
        const originalState = config.get('debugEnabled');
        
        await vscode.commands.executeCommand('faah-terminal-alert.debug');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const newState = vscode.workspace.getConfiguration('faah-terminal-alert').get('debugEnabled');
        assert.notStrictEqual(originalState, newState, 'Debug state should be toggled');
        
        // Restore original state
        await vscode.commands.executeCommand('faah-terminal-alert.debug');
        console.log('✓ Toggle debug test passed');
    });
    
    test('Test sound command should execute', async () => {
        try {
            await vscode.commands.executeCommand('faah-terminal-alert.testSound');
            assert.ok(true, 'Test sound command should execute successfully');
            console.log('✓ Test sound command passed');
        } catch (error) {
            assert.fail(`Test sound command failed: ${error}`);
        }
    });
});