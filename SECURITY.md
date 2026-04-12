# Security Policy

## Overview

FAAH Terminal Alert executes platform-specific system commands strictly for audio playback when a terminal command fails.

## Command Usage

The extension uses system-level audio commands depending on the platform:

| Platform | Command | Purpose |
|----------|---------|---------|
| **Windows** | `powershell -c "[Console]::Beep(...)"` | Plays beep sound |
| **Windows (fallback)** | `powershell -c "(New-Object Media.SoundPlayer...).PlaySync()"` | Plays WAV file |
| **macOS** | `afplay` | Plays WAV file |
| **Linux** | `aplay` or `paplay` | Plays WAV file |

## Safety Guarantees

✅ **No user input is ever passed to system commands** - All commands are hardcoded and predefined

✅ **No arbitrary code execution** - The extension only executes pre-approved audio playback commands

✅ **Commands are read-only** - Only audio output, no file modifications

✅ **No persistent background processes** - Commands run and terminate immediately

✅ **No data is transmitted externally** - All operations are local

✅ **When disabled, no commands execute** - Extension remains completely idle

## User Control

Users have full control over the extension:

| Control | Method |
|---------|--------|
| **Enable/Disable** | Settings or status bar toggle |
| **Debug logging** | Settings or command palette |
| **Cooldown period** | Settings (default 1000ms) |

## Permissions

The extension requests no special permissions beyond:
- `onStartupFinished` - Activation event
- Terminal event listening (VS Code API)

## Reporting Issues

If you discover a security issue:

1. **Do NOT** open a public GitHub issue
2. **Email**: security@[your-domain] (or use GitHub private vulnerability reporting)
3. **Expected response**: Within 48 hours

## Compliance

- ✅ Follows VS Code extension security best practices
- ✅ Commands are documented and justified
- ✅ User consent required (enabled by default, can be disabled)
- ✅ No data collection or telemetry

## Version History

| Version | Security Notes |
|---------|----------------|
| 1.0.0 | Initial release - audio-only system commands |

---

*This extension is designed with security and transparency as core principles.*