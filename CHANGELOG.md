# Changelog

All notable changes to the "FAAH Terminal Alert" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-22

### Added
- **Terminal error detection** - Plays FAAH sound when terminal commands exit with non-zero status codes
- **Toggle sound on/off** - Status bar icon and command to enable/disable sound
- **Debug mode** - Detailed logging for troubleshooting with timestamped messages
- **Configurable cooldown** - Prevents sound spamming (default 1000ms, user-configurable)
- **Test sound command** - Play the FAAH sound for verification
- **Keyboard shortcuts** - Quick access to toggle sound, debug mode, and test sound
- **Status bar indicators** - Visual feedback for sound state, debug state, and test sound
- **Persistent settings** - Sound enabled, debug enabled, and cooldown settings saved to VS Code settings
- **Live configuration updates** - Settings apply immediately without restart
- **Platform fallbacks** - Supports Windows (PowerShell), macOS (afplay), and Linux (aplay/paplay/ffplay)
- **Output channel logging** - Centralized logging in "FAAH Terminal Alert" output panel

### Technical
- Uses `onDidEndTerminalShellExecution` API for reliable terminal monitoring
- Bundled FAAH sound file included with extension
- TypeScript implementation with esbuild for fast compilation
- Minimal resource usage and non-intrusive design

### Documentation
- Complete README with installation, usage, settings, shortcuts, and troubleshooting
- Accurate feature descriptions matching actual implementation
- SEO-friendly structure for GitHub and VS Code Marketplace

---