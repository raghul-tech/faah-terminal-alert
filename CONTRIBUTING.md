# Contributing to FAAH Terminal Alert

Thank you for your interest in contributing to FAAH Terminal Alert! This document provides guidelines and information about contributing to this project.

## 🤝 How to Contribute

### Reporting Bugs

- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Provide detailed information about your environment
- Include steps to reproduce the issue
- Add screenshots if applicable

### Suggesting Features

- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Clearly describe the feature and its use case
- Explain why it would be valuable to users

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/raghul-tech/faah-terminal-alert.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run build
   # Press F5 to test in VS Code
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues
   - Include screenshots if applicable

## 🛠️ Development Setup

### Prerequisites
- VS Code Extension Development Host
- Node.js (for npm scripts)

### Setup
```bash
git clone https://github.com/raghul-tech/faah-terminal-alert.git
cd faah-terminal-alert
npm install
```

### Build & Test
```bash
npm run build    # Build for production
npm run watch    # Watch for changes during development
```

Press `F5` in VS Code to launch the Extension Development Host.

## 📝 Code Style Guidelines

- Use TypeScript for all new code
- Follow existing naming conventions
- Keep functions small and focused
- Add JSDoc comments for public methods
- Update README.md if adding user-facing features

## 🐛 Testing

- Test your changes on different platforms (Windows, macOS, Linux)
- Verify sound playback works correctly
- Check that settings persist properly
- Ensure no memory leaks or performance issues

## 📚 Documentation

- Update README.md for user-facing changes
- Update CHANGELOG.md for new features or bug fixes
- Add inline comments for complex logic

## 🚀 Submitting Changes

### Pull Request Process

1. Ensure your PR description clearly describes the problem and solution
2. Link to any relevant issues
3. Include screenshots for UI changes
4. Wait for code review
5. Make requested changes if any

### Commit Message Format

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Examples:
```
feat: add custom sound file support
fix: resolve cooldown not working on macOS
docs: update installation instructions
```

## 📧 Getting Help

If you need help with contributing:
- Create an issue with the `question` label
- Email us at: raghul-tech.app@gmail.com
- Check existing issues and discussions

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same MIT License as the project.

---

Thank you for contributing to FAAH Terminal Alert! 🎉
