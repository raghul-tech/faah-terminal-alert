# Privacy Policy for FAAH Terminal Alert

**Last Updated:** April 9, 2025  
**Effective Date:** April 9, 2025

## Overview

FAAH Terminal Alert ("the Extension") is a Visual Studio Code extension designed to play audio alerts when terminal commands fail. This privacy policy explains what data the Extension collects, how it's used, and your privacy rights.

## Information We Collect

### No Personal Data Collection

The FAAH Terminal Alert extension:
- **Does not collect** any personal information
- **Does not transmit** any data to external servers
- **Does not use** analytics or tracking services
- **Does not access** your files or code content
- **Does not store** any user data externally

### Local Data Storage

The Extension only stores configuration settings locally in your VS Code settings:
- Sound enabled/disabled preference
- Debug mode preference
- Cooldown duration setting

These settings are stored locally on your machine using VS Code's standard configuration system and are not accessible to the extension developers.

## How the Extension Works

### Terminal Monitoring
The Extension monitors terminal exit codes using VS Code's `onDidEndTerminalShellExecution` API. It only checks:
- Whether a terminal command has finished
- The exit code (zero for success, non-zero for failure)

No terminal content, commands, or outputs are accessed or stored.

### Audio Playback
The Extension plays a bundled sound file ("FAAH" sound) when:
- A terminal command fails (non-zero exit code)
- The sound feature is enabled
- The cooldown period has passed

No audio recording or microphone access is performed.

## Data Sharing

We do not share, sell, or transfer any data because:
- No personal data is collected
- No usage data is collected
- No analytics data is collected
- All settings remain local to your VS Code installation

## Third-Party Services

The Extension does not use any third-party services or APIs.

## Data Security

Since no data is collected or transmitted, there are no security risks related to data handling. The Extension operates entirely within your local VS Code environment.

## User Rights

You have complete control over the Extension:
- **Enable/Disable**: Toggle sound alerts on/off
- **Configure Settings**: Adjust cooldown and debug preferences
- **Uninstall**: Remove the Extension completely at any time
- **Access Settings**: View and modify all Extension settings in VS Code

## Changes to This Privacy Policy

We may update this privacy policy if:
- The Extension's functionality changes significantly
- New features are added that affect data handling
- Legal requirements necessitate changes

Any changes will be:
- Posted in this document
- Updated with a new "Last Updated" date
- Described in the Extension's release notes

## Contact Information

If you have questions about this privacy policy or the Extension's privacy practices:

**Email:** raghul-tech.app@gmail.com  
**GitHub:** https://github.com/raghul-tech/faah-terminal-alert

## Technical Details

### APIs Used
- `vscode.window.onDidEndTerminalShellExecution` - For terminal monitoring
- `vscode.workspace.getConfiguration` - For accessing settings
- `vscode.window.createOutputChannel` - For debug logging (local only)

### Files Accessed
- Extension's own bundled sound file (`media/faah.wav`)
- VS Code settings storage (standard VS Code mechanism)
- Local temporary files for audio playback (system-managed)

### Network Activity
The Extension does not make any network requests.

---

This privacy policy is designed to be transparent and straightforward. The FAAH Terminal Alert extension is built with privacy as a core principle - we don't collect, store, or transmit any user data.
