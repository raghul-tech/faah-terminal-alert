# 🔔 FAAH Terminal Alert

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=raghul-tech.faah-terminal-alert)
[![VS Code](https://img.shields.io/badge/vscode-^1.74.0-blue.svg)](https://code.visualstudio.com/)
[![GitHub](https://img.shields.io/badge/github-repo-green.svg)](https://github.com/raghul-tech/faah-terminal-alert)
[![CI](https://github.com/raghul-tech/faah-terminal-alert/workflows/CI/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/ci.yml)
[![Lint](https://github.com/raghul-tech/faah-terminal-alert/workflows/Lint%20and%20Format/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/lint.yml)
[![Release](https://github.com/raghul-tech/faah-terminal-alert/workflows/Release%20and%20Publish/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/release.yml)

**Plays FAAH sound when terminal commands fail (non-zero exit code). Never miss an error again!**

---

## 🎯 What is FAAH Terminal Alert?

FAAH Terminal Alert is a VS Code extension that plays a distinctive **"FAAH" sound** whenever a terminal command exits with a non-zero status code. Stop staring at your terminal—let your ears tell you when something goes wrong!

### 🚀 Perfect for:
- **Long-running builds** - Work on other tasks while your code compiles
- **Running tests** - Get audio feedback when tests fail
- **Package installation** - Know immediately if npm/pip/yarn fails
- **Docker operations** - Hear when container builds fail *(PowerShell/CMD terminals)*
- **Git operations** - Audio alerts for merge conflicts or push failures *(PowerShell/CMD terminals)*

> **Note**: Git Bash may not always report exit codes properly to VS Code. For best results, use PowerShell, CMD, or integrated terminals.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| � **Terminal Error Detection** | Detects non-zero exit codes from any terminal command |
| 🎛️ **Toggle Sound** | Enable/disable sound with one click |
| 🐞 **Debug Mode** | Detailed logging for troubleshooting |
| ⚡ **Cooldown** | Prevents sound spamming (default 1000ms, configurable) |
| ⌨️ **Keyboard Shortcuts** | Quick access to all features |
| 🎨 **Status Bar Icons** | Visual indicators for current state |
| 🧪 **Test Sound** | Play the FAAH sound on demand |

---

## 📥 Installation

### From VS Code Marketplace (Recommended)
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for `FAAH Terminal Alert`
4. Click **Install**

### Manual Installation
```bash
# Clone the repository
git clone https://github.com/raghul-tech/faah-terminal-alert.git

# Navigate to folder
cd faah-terminal-alert

# Install dependencies
npm install

# Build the extension
npm run build

# Copy to VS Code extensions folder
cp -r . ~/.vscode/extensions/faah-terminal-alert/
```

## 🎮 How to Use

### 1️⃣ After Installation
The extension activates automatically. You'll see a **🔔 FAAH** icon in the bottom-right status bar.

### 2️⃣ Run Terminal Commands
Open a terminal (`Ctrl+``) and run any command. If it fails, you'll hear the FAAH sound instantly.

### 3️⃣ Toggle Sound On/Off
- Click the **bell icon** in the status bar
- Or use the command palette (`Ctrl+Shift+P`) → **FAAH: Toggle Sound**

### 4️⃣ Test the Sound
- Click the **🧪 Test Sound** icon in the status bar
- Or use the command palette → **FAAH: Test Sound**

### 5️⃣ Debug Mode
- Enable debug mode in settings or via the command palette → **FAAH: Toggle Debug**
- View logs in **Output → FAAH Terminal Alert**

---

## ⚙️ Settings

Open VS Code Settings (`Ctrl+,`) and search for `faah-terminal-alert`.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable the sound alert |
| `debugEnabled` | boolean | `false` | Enable debug logging |
| `cooldown` | number | `1000` | Minimum milliseconds between sounds (anti-spam) |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Ctrl+Alt+F` | `faahTerminalAlert.toggleSound` | Toggle sound on/off |
| `Ctrl+Alt+D` | `faahTerminalAlert.toggleDebug` | Toggle debug mode |
| `Ctrl+Alt+T` | `faahTerminalAlert.testSound` | Play test sound |

*Tip: You can customize these shortcuts in VS Code Settings → Keyboard Shortcuts.*

---

## 🎨 Status Bar Icons

| Icon | Name | Action |
|------|------|--------|
| 🔔 | Sound Toggle | Click to toggle sound on/off |
| 🐞 | Debug Toggle | Click to toggle debug mode |
| 🧪 | Test Sound | Click to play the FAAH sound |

---

## 🔧 How It Works

1. **Terminal Monitoring**: The extension listens to `onDidEndTerminalShellExecution` events to detect non-zero exit codes.
2. **Sound Playback**: When an error is detected, it plays the bundled FAAH sound using a persistent audio process.
3. **Cooldown**: A cooldown timer prevents sound spamming (configurable via settings).
4. **Fallbacks**: If the persistent process fails, it falls back to platform-specific playback (`aplay`, `afplay`, `powershell`, or `ffplay`).

---

## 🐛 Troubleshooting

### No Sound?
- Check that **Sound is enabled** (status bar bell icon)
- Ensure your system volume is up
- Try **Test Sound** from the status bar or command palette
- Enable **Debug Mode** to see detailed logs

### Git Bash Not Working?
- **Git Bash may not report exit codes** to VS Code properly
- **Solution**: Use PowerShell, CMD, or VS Code's integrated terminal
- **Alternative**: Run git commands in PowerShell instead of Git Bash

### Remote/SSH Environments
- Audio playback may not work over SSH due to lack of audio device.
- Enable Debug Mode to see fallback attempts.

### Cooldown Not Respected?
- Ensure `cooldown` setting is a number (milliseconds).
- Restart VS Code after changing settings.

### Where to See Logs?
- Open **Output Panel** (`Ctrl+Shift+U` → Select **FAAH Terminal Alert**)
- Enable **Debug Mode** for verbose logs.

---

## 🛠️ Development

### Prerequisites
- VS Code Extension Development Host
- Node.js (for npm scripts)

### Setup
```bash
git clone https://github.com/raghul-tech/faah-terminal-alert.git
cd faah-terminal-alert
npm install
```

### Build & Run
```bash
npm run build      # Build for production
npm run watch      # Watch for changes
```

Press `F5` in VS Code to open a new Extension Development Host window with your extension loaded.

---

## 📄 License

[MIT License](LICENSE)

---

## 📚 Additional Resources

- [Privacy Policy](PRIVACY.md) - How we protect your privacy
- [Support](SUPPORT.md) - Get help and troubleshooting
- [Contributing](CONTRIBUTING.md) - How to contribute to the project
- [Code of Conduct](CODE_OF_CONDUCT.md) - Our community guidelines

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

**Made with ❤️ for developers who hate staring at terminals!**