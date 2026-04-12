# 🔔 FAAH Terminal Alert

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=raghul-tech.faah-terminal-alert)
[![VS Code](https://img.shields.io/badge/vscode-^1.74.0-blue.svg)](https://code.visualstudio.com/)
[![GitHub](https://img.shields.io/badge/github-repo-green.svg)](https://github.com/raghul-tech/faah-terminal-alert)
[![CI](https://github.com/raghul-tech/faah-terminal-alert/workflows/CI/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/ci.yml)
[![Lint](https://github.com/raghul-tech/faah-terminal-alert/workflows/Lint%20and%20Format/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/lint.yml)
[![Release](https://github.com/raghul-tech/faah-terminal-alert/workflows/Release%20and%20Publish/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/release.yml)

**🔔 Plays instant audio alerts when terminal commands fail!**

---

## 🎯 What is FAAH Terminal Alert?

FAAH Terminal Alert is a lightweight VS Code extension that plays a distinctive **"FAAH" sound** whenever a terminal command exits with a non-zero status code. Stop staring at your terminal—let your ears tell you when something goes wrong!

### 🚀 Perfect for:
- **🏗 Long-running builds** - Work on other tasks while code compiles
- **🧪 Running tests** - Get instant audio feedback when tests fail  
- **📦 Package installation** - Know immediately if npm/pip/yarn fails
- **🐳 Docker operations** - Hear when container builds fail *(PowerShell terminals)*
- **🔀 Git operations** - Audio alerts for merge conflicts or push failures *(PowerShell terminals)*

> **💡 Pro Tip**: For best results, use PowerShell terminals. CMD and Git Bash have limited exit code detection support.

---

## ✨ Features

| 🌟 Feature | 📝 Description |
|-------------|-------------|
| 🔍 **Terminal Error Detection** | Detects non-zero exit codes from any terminal command |
| 🔔 **Toggle Sound** | Enable/disable sound with one click |
| 🐞 **Debug Mode** | Optional logging for troubleshooting |
| ⏱️ **Cooldown** | Configurable delay between sounds (default 1000ms) |
| ⌨️ **Keyboard Shortcuts** | Quick access to all features |
| 🎨 **Status Bar Icons** | Visual indicators for current state |
| 🧪 **Test Sound** | Play FAAH sound on demand |

---

## 📥 Installation

### 🏪 From VS Code Marketplace (Recommended)
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for `FAAH Terminal Alert`
4. Click **Install**

### 🔧 Manual Installation
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

---

## 🎮 How to Use

### 1️⃣ After Installation
The extension activates automatically. You'll see a **🔔 FAAH** icon in the bottom-right status bar.

### 2️⃣ Run Terminal Commands
Open a terminal (`Ctrl+``) and run any command. If it fails, you'll hear the FAAH sound instantly!

### 3️⃣ Toggle Sound On/Off
- Click the **🔔 bell icon** in the status bar
- Or use the command palette (`Ctrl+Shift+P`) → **FAAH: Toggle Sound**

### 4️⃣ Test Sound
- Click the **🧪 test icon** in the status bar
- Or use the command palette → **FAAH: Test Sound**

### 5️⃣ Debug Mode
- Enable debug mode in settings or via the command palette → **FAAH: Toggle Debug**
- View logs in **Output → FAAH Terminal Alert**

---

## ⚙️ Settings

Open VS Code Settings (`Ctrl+,`) and search for `faah-terminal-alert`.

| ⚙️ Setting | 📝 Type | 🎯 Default | 📄 Description |
|-------------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable sound alert |
| `debugEnabled` | boolean | `false` | Enable debug logging |
| `cooldown` | number | `1000` | Minimum milliseconds between sounds (anti-spam) |

---

## ⌨️ Keyboard Shortcuts

| ⌨️ Shortcut | 🎯 Command | 📄 Description |
|-------------|-------------|-------------|
| `Ctrl+Alt+F` | `faahTerminalAlert.toggleSound` | Toggle sound on/off |
| `Ctrl+Alt+D` | `faahTerminalAlert.toggleDebug` | Toggle debug mode |
| `Ctrl+Alt+T` | `faahTerminalAlert.testSound` | Play test sound |

*💡 Tip: You can customize these shortcuts in VS Code Settings → Keyboard Shortcuts.*

---

## 🎨 Status Bar Icons

| 🎨 Icon | 📝 Name | 📄 Action |
|------|------|--------|-------------|
| 🔔 | Sound Toggle | Click to toggle sound on/off |
| 🐞 | Debug Toggle | Click to toggle debug mode |
| 🧪 | Test Sound | Click to play FAAH sound |

---

## 🔧 How It Works

The extension uses VS Code's official terminal API to detect when a command completes. If the command exits with an error code, a notification sound plays using platform-specific audio commands:

### 🪟 **Windows**
- **Primary**: Uses `spawn()` with `powershell.exe` to play preloaded base64 audio
- **Fallback**: Uses `exec()` with `powershell.exe -Command (New-Object Media.SoundPlayer).PlaySync()`

### 🐧 **Linux**
- **Primary**: Uses `spawn()` with `aplay` command
- **Fallback**: Uses `exec()` with `aplay` or `ffplay`

### 🍎 **macOS**
- **Primary**: Uses `spawn()` with `afplay` command
- **Fallback**: Uses `exec()` with `afplay` or `ffplay`

### 🔧 **Why We Use These Methods**
- **Instant playback** - No external dependencies required
- **Cross-platform compatibility** - Works on Windows, Linux, and macOS
- **Reliability** - Multiple fallback methods ensure sound plays
- **Performance** - Cached audio for instant response

All functionality runs locally within VS Code using system audio commands.

---

## 🐛 Troubleshooting

### 🔇 No Sound?
- Check that **Sound is enabled** (status bar bell icon)
- Ensure your system volume is up
- Try **Test Sound** from the status bar or command palette
- Enable **Debug Mode** to see detailed logs

### 🐚 Git Bash Not Working?
- **Git Bash may not report exit codes** to VS Code properly
- **Solution**: Use PowerShell, CMD, or VS Code's integrated terminal
- **Alternative**: Run git commands in PowerShell instead of Git Bash

### 🌐 Remote/SSH Environments
- **Audio playback may not work** over SSH due to lack of audio device
- **Enable Debug Mode** to see fallback attempts

### ⏱️ Cooldown Not Respected?
- Ensure `cooldown` setting is a number (milliseconds)
- **Restart VS Code** after changing settings

### 📋 Where to See Logs?
- Open **Output Panel** (`Ctrl+Shift+U` → Select **FAAH Terminal Alert**)
- **Enable Debug Mode** for verbose logs

---

## 🛠️ Development

### 📚 Prerequisites
- **VS Code Extension Development Host**
- **Node.js**

### 🔧 Setup
```bash
git clone https://github.com/raghul-tech/faah-terminal-alert.git
cd faah-terminal-alert
npm install
```

### 🏗 Build & Run
```bash
npm run build      # Build for production
npm run watch      # Watch for changes
```

Press `F5` in VS Code to open a new Extension Development Host window with your extension loaded.

---

## 🔒 Security

This extension:

- ✅ **Uses only VS Code's official APIs** for terminal monitoring
- ⚡ **Executes system audio commands** for sound playback (platform-specific):
  - Windows: `powershell.exe` for audio playback
  - Linux: `aplay` or `ffplay` commands
  - macOS: `afplay` or `ffplay` commands
- 🚫 **Does NOT access files outside of workspace**
- 📵 **Does NOT send any data over the network**
- 🏠 **All processing is local and transparent**

### 🔧 **Why System Commands?**
- **Instant audio playback** without external dependencies
- **Cross-platform compatibility** - works on Windows, Linux, macOS
- **No additional software** required by users
- **Reliable fallback methods** ensure sound always plays

All audio commands are executed locally and safely for playback only.

---

## 📄 License

[MIT License](https://github.com/raghul-tech/faah-terminal-alert/blob/main/LICENSE)

---

## 🔗 Additional Resources

- [🔒 Privacy Policy](https://github.com/raghul-tech/faah-terminal-alert/blob/main/PRIVACY.md) - How we protect your privacy
- [🛠️ Support](https://github.com/raghul-tech/faah-terminal-alert/blob/main/SUPPORT.md) - Get help and troubleshooting
- [🤝 Contributing](https://github.com/raghul-tech/faah-terminal-alert/blob/main/CONTRIBUTING.md) - How to contribute to the project
- [📜 Code of Conduct](https://github.com/raghul-tech/faah-terminal-alert/blob/main/CODE_OF_CONDUCT.md) - Our community guidelines

---

## 🤝 Contributing

🎉 Contributions are welcome! Please open an issue or submit a pull request.

---

**Made with ❤️ for developers who need audio feedback for terminal errors!** 🚀