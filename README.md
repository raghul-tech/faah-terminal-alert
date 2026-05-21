# 🔔 Terminal Failure Alert

> **Plays a sound when your terminal commands fail — so you can stop staring at the screen.**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=raghul-tech.faah-terminal-alert)
[![VS Code](https://img.shields.io/badge/vscode-^1.74.0-blue.svg)](https://code.visualstudio.com/)
[![GitHub](https://img.shields.io/badge/github-repo-green.svg)](https://github.com/raghul-tech/faah-terminal-alert)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![CI](https://github.com/raghul-tech/faah-terminal-alert/workflows/CI/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/ci.yml)
[![Lint](https://github.com/raghul-tech/faah-terminal-alert/workflows/Lint%20and%20Format/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/lint.yml)
[![Release](https://github.com/raghul-tech/faah-terminal-alert/workflows/Release%20and%20Publish/badge.svg)](https://github.com/raghul-tech/faah-terminal-alert/actions/workflows/release.yml)

---

## What It Does

**FAAH Terminal Alert** monitors your VS Code integrated terminal and plays an audio notification whenever a command exits with a non-zero status code (i.e., it failed).

No more switching back to VS Code to check if your long build finished — or worse, if it crashed silently.

### Built for:
- Long-running builds and compilations
- Test suites (`npm test`, `pytest`, `cargo test`)
- Package installs
- Docker builds and deployments
- Git operations

---

## Features

| Feature | Description |
|---------|-------------|
| **Failure Detection** | Detects non-zero exit codes from terminal commands |
| **Audio Alert** | Plays a sound notification immediately on failure |
| **Toggle On/Off** | Enable or disable with one click or keyboard shortcut |
| **Test Sound** | Play the alert on demand to confirm it's working |
| **Debug Mode** | Optional logging to the Output panel for troubleshooting |
| **Cooldown Control** | Configurable minimum delay between alerts (default 1000ms) |
| **Status Bar Icons** | Visual indicators showing current extension state |

---

## Installation

**From the VS Code Marketplace:**

1. Open VS Code
2. Open Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for `FAAH Terminal Alert`
4. Click **Install**

**From a `.vsix` file:**
```bash
code --install-extension raghul-tech.faah-terminal-alert-1.0.0.vsix
```

---

## How to Use

### Automatic Detection
The extension activates automatically when VS Code starts. A 🔔 icon appears in the status bar (bottom right). Run any terminal command — if it fails, you'll hear the alert.

### Toggle Sound On/Off
- Click the **🔔 bell icon** in the status bar
- Or open the Command Palette (`Ctrl+Shift+P`) → `FAAH Terminal Alert: Toggle Sound`
- Or use `Ctrl+Alt+F` (`Cmd+Alt+F` on macOS)

### Test the Alert
- Click the **🧪 icon** in the status bar
- Or Command Palette → `FAAH Terminal Alert: Test Sound`
- Or use `Ctrl+Alt+T` (`Cmd+Alt+T` on macOS)

### Debug Mode
- Command Palette → `FAAH Terminal Alert: Toggle Debug Logging`
- View logs: **Output panel** (`Ctrl+Shift+U`) → select `FAAH Terminal Alert`

---

## Settings

Search for `faah-terminal-alert` in VS Code Settings (`Ctrl+,`).

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `faah-terminal-alert.enabled` | boolean | `true` | Enable or disable sound alerts |
| `faah-terminal-alert.debugEnabled` | boolean | `false` | Enable verbose debug logging |
| `faah-terminal-alert.cooldown` | number | `1000` | Minimum milliseconds between alerts (prevents repeated sounds) |

---

## Keyboard Shortcuts

| Shortcut | Mac | Action |
|----------|-----|--------|
| `Ctrl+Alt+F` | `Cmd+Alt+F` | Toggle sound on/off |
| `Ctrl+Alt+D` | `Cmd+Alt+D` | Toggle debug logging |
| `Ctrl+Alt+T` | `Cmd+Alt+T` | Play test sound |

> You can customize these in **File → Preferences → Keyboard Shortcuts**.

---

## Status Bar Icons

| Icon | Description | Click Action |
|------|-------------|--------------|
| 🔔 | Sound is enabled | Toggle off |
| 🔕 | Sound is disabled | Toggle on |
| 🐞 | Debug mode indicator | Toggle debug |
| 🧪 | Test sound button | Play alert |

---

## How It Works

The extension uses VS Code's official terminal event APIs to listen for command completion events. When a command exits with a non-zero code, it triggers an audio notification using the operating system's built-in audio capabilities.

- All processing happens **locally within VS Code**
- **No data is collected, stored, or transmitted**
- The extension is **completely idle when disabled** — no background activity of any kind
- Audio playback uses standard OS-level audio — no third-party audio servers required

> **Note:** For reliable exit code detection, **PowerShell** terminals work best. Git Bash and some custom shells may not report exit codes to VS Code's terminal API consistently.

---

## Troubleshooting

**No sound playing?**
- Check the status bar — ensure the 🔔 icon shows sound is enabled
- Try **Test Sound** from the status bar to confirm audio is working
- Check your system volume
- Enable Debug Mode and check the Output panel for details

**Not detecting failures?**
- Switch to a **PowerShell** terminal — Git Bash has limited exit code reporting
- Enable Debug Mode to see what events the extension is receiving

**Sound not working over SSH / Remote?**
- Remote environments typically have no audio device on the local machine
- This is a known limitation of remote development — the sound plays server-side where there is no audio output

**Cooldown setting not applying?**
- Ensure the value is a number (milliseconds), not a string
- Restart VS Code after changing the setting

---

## Privacy & Security

- ✅ **No data collection** — the extension does not collect, store, or transmit any information
- ✅ **No network access** — all operations are entirely local
- ✅ **No file modification** — the extension only reads terminal events and outputs audio
- ✅ **Audio uses OS built-in capabilities** — no external audio libraries or servers
- ✅ **Fully transparent** — source code is publicly available on GitHub

---

## Contributing

Contributions are welcome. Please open an issue to discuss what you'd like to change before submitting a pull request.

- [Report a Bug](https://github.com/raghul-tech/faah-terminal-alert/issues)
- [Request a Feature](https://github.com/raghul-tech/faah-terminal-alert/issues)
- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

*Made for developers who'd rather hear a sound than stare at a terminal.*