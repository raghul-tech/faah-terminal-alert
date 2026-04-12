# 🔔 FAAH Terminal Alert

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=raghul-tech.faah-terminal-alert)
[![VS Code](https://img.shields.io/badge/vscode-^1.74.0-blue.svg)](https://code.visualstudio.com/)
[![GitHub](https://img.shields.io/badge/github-repo-green.svg)](https://github.com/raghul-tech/faah-terminal-alert)
[![CI](https://github.com/raghul-tech/faah-terminal-alert/workflows/CI/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/ci.yml)
[![Lint](https://github.com/raghul-tech/faah-terminal-alert/workflows/Lint%20and%20Format/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/lint.yml)
[![Release](https://github.com/raghul-tech/faah-terminal-alert/workflows/Release%20and%20Publish/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/release.yml)

**Plays FAAH sound when terminal commands fail (non-zero exit code).**

---

## 🎯 What is FAAH Terminal Alert?

FAAH Terminal Alert is a VS Code extension that plays a distinctive **"FAAH" sound** when a terminal command exits with a non-zero status code.

### Perfect for:
- Long-running builds
- Running tests
- Package installation
- Docker operations
- Git operations

> **Note**: For best results, use PowerShell terminals. CMD and Git Bash have limited exit code detection support.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Terminal Error Detection** | Detects non-zero exit codes from terminal commands |
| **Toggle Sound** | Enable or disable sound with one click |
| **Debug Mode** | Optional logging for troubleshooting |
| **Cooldown** | Configurable delay between sounds (default 1000ms) |
| **Keyboard Shortcuts** | Quick access to all features |
| **Status Bar Icons** | Visual indicators for current state |
| **Test Sound** | Play FAAH sound on demand |

---

## 📥 Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for `FAAH Terminal Alert`
4. Click **Install**

### Manual Installation
```bash
git clone https://github.com/raghul-tech/faah-terminal-alert.git
cd faah-terminal-alert
npm install
npm run build
cp -r . ~/.vscode/extensions/faah-terminal-alert/
```

## 🎮 How to Use

After Installation
The extension activates automatically. A 🔔 FAAH icon appears in the bottom-right status bar.

Run Terminal Commands
Open a terminal (`Ctrl+``) and run any command. If it fails, FAAH sound plays.

Toggle Sound On/Off
Click the bell icon in the status bar

Or use the command palette (Ctrl+Shift+P) → FAAH: Toggle Sound

Test Sound
Click the test icon in the status bar

Or use the command palette → FAAH: Test Sound

Debug Mode
Enable via command palette → FAAH: Toggle Debug

View logs in Output → FAAH Terminal Alert

## ⚙️ Settings

Open VS Code Settings (`Ctrl+,`) and search for `faah-terminal-alert`.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable or disable sound alert |
| `debugEnabled` | boolean | `false` | Enable debug logging |
| `cooldown` | number | `1000` | Minimum milliseconds between sounds (anti-spam) |

## ⌨️ Keyboard Shortcuts

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Ctrl+Alt+F` | `faahTerminalAlert.toggleSound` | Toggle sound on/off |
| `Ctrl+Alt+D` | `faahTerminalAlert.toggleDebug` | Toggle debug mode |
| `Ctrl+Alt+T` | `faahTerminalAlert.testSound` | Play test sound |

*Tip: You can customize these shortcuts in VS Code Settings → Keyboard Shortcuts.*

## 🎨 Status Bar Icons

| Icon | Name | Action |
|------|------|--------|
| 🔔 | Sound Toggle | Click to toggle sound on/off |
| 🐞 | Debug Toggle | Click to toggle debug mode |
| 🧪 | Test Sound | Click to play FAAH sound |

---

## 🔧 How It Works

The extension uses VS Code's official terminal APIs to detect when commands complete.

If a command exits with a non-zero code, a notification sound is played to alert the user.

The extension remains idle otherwise and only reacts to terminal events. All functionality runs locally within VS Code.

---

## 🐛 Troubleshooting

### No Sound?
Check that sound is enabled (status bar bell icon)

Ensure your system volume is up

Try Test Sound from the status bar

Enable Debug Mode to see logs

### Git Bash Not Working?
Git Bash may not report exit codes to VS Code properly

Solution: Use PowerShell or CMD terminals instead

### Remote/SSH Environments
Audio may not work over SSH due to no audio device

Enable Debug Mode to see details

### Cooldown Not Respected?
Ensure `cooldown` setting is a number (milliseconds)

Restart VS Code after changing settings

### Where to See Logs?
Open Output Panel (Ctrl+Shift+U → Select FAAH Terminal Alert)

Enable Debug Mode for verbose logs

---

## 🔒 Security

This extension uses **system audio commands** to play sound:

| Platform | Command Used |
|----------|--------------|
| Windows | `powershell -c "[Console]::Beep(...)"` |
| macOS | `afplay` |
| Linux | `aplay` or `paplay` |

### What This Means

- ✅ Commands are **read-only** (audio output only)
- ✅ Commands are **pre-defined** (no user input is ever executed)
- ✅ All commands are **standard system utilities**
- 🚫 No files are read or modified
- 🚫 No data is sent over the network

### User Control

- **When enabled**: Extension listens to terminal events and plays sound on failure using system audio commands
- **When disabled**: **No commands are executed** - extension remains completely inactive
- **Full control**: Users can enable/disable at any time via settings

> The system commands are necessary for cross-platform audio playback and are fully documented.

### **User Control**

- **When enabled**: Listens to terminal events and plays sound on failure
- **When disabled**: **No commands are executed** - extension remains completely inactive
- **Full control**: Users can enable/disable at any time via settings

> **Note**: When the extension is turned off, it does not execute any system commands or background processes.

---

## 🛠️ Development

### Prerequisites
- VS Code Extension Development Host
- Node.js

### Setup
```bash
git clone https://github.com/raghul-tech/faah-terminal-alert.git
cd faah-terminal-alert
npm install
```

### Build & Run
```bash
npm run build
npm run watch
```

Press F5 to test in an Extension Development Host window.

---

## License

[MIT License](https://github.com/raghul-tech/faah-terminal-alert/blob/main/LICENSE)

---

## Additional Resources

- [Security Policy](https://github.com/raghul-tech/faah-terminal-alert/blob/main/SECURITY.md)
- [Privacy Policy](https://github.com/raghul-tech/faah-terminal-alert/blob/main/PRIVACY.md)
- [Support](https://github.com/raghul-tech/faah-terminal-alert/blob/main/SUPPORT.md)
- [Contributing](https://github.com/raghul-tech/faah-terminal-alert/blob/main/CONTRIBUTING.md)
- [Code of Conduct](https://github.com/raghul-tech/faah-terminal-alert/blob/main/CODE_OF_CONDUCT.md)

---

## 🤝 Contributing

Contributions welcome. Please open an issue or submit a pull request.

---

Made for developers who need audio feedback for terminal errors.