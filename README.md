# FAAH Terminal

Plays a "FAAH" sound effect whenever errors occur in the terminal.

## Features

- 🔊 Plays sound on terminal command failures
- ⚡ Instant playback with preloaded audio
- 🎯 Detects errors from:
  - Task exit codes
  - Terminal output patterns
  - Editor diagnostics
- ⏰ Configurable cooldown and quiet hours
- 🎵 Custom sound file support

## Requirements

- VS Code 1.60.0 or higher
- A sound file in the `media` folder (faah.mp3 or faah.wav)

## Extension Settings

This extension contributes the following settings:

* `faah-terminal.enabled`: Enable/disable the sound
* `faah-terminal.cooldown`: Time between sounds (ms)
* `faah-terminal.errorPatterns`: Regex patterns to detect errors
* `faah-terminal.quietHours`: Set quiet hours
* `faah-terminal.customSoundPath`: Path to custom sound file

## Commands

- `FAAH: Test Sound` - Test the sound playback
- `FAAH: Toggle Sound` - Enable/disable
- `FAAH: Select Custom Sound` - Choose your own sound file

## Release Notes

### 1.0.0

Initial release with instant error detection and sound playback