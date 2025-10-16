# Contributing to Type Style Sample Creator

Thank you for your interest in contributing to Type Style Sample Creator! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Build the plugin: `npm run build`
5. Make your changes
6. Test your changes in Figma

## Development Workflow

### Setting Up Your Development Environment

1. Install Node.js (version 14 or higher)
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the build in watch mode for development:
   ```bash
   npm run watch
   ```

4. In Figma:
   - Go to `Plugins` → `Development` → `Import plugin from manifest...`
   - Select the `manifest.json` file
   - Reload the plugin after making changes

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure code is properly formatted

### Testing Your Changes

Before submitting a pull request:

1. Test the plugin with various text objects
2. Verify it works with different fonts and styles
3. Check edge cases (missing fonts, unusual values)
4. Ensure the build completes without errors

## Making Changes

### Commit Messages

Write clear, descriptive commit messages:
- Use present tense ("Add feature" not "Added feature")
- Keep the first line under 72 characters
- Reference issues when applicable

Example:
```
Add support for multiple text selections

- Allow users to create specimens for multiple text objects
- Position specimens in a grid layout
- Fixes #123
```

### Pull Requests

1. Create a new branch for your feature or bug fix
2. Make your changes
3. Test thoroughly
4. Submit a pull request with a clear description of your changes

Include in your PR description:
- What changes you made
- Why you made them
- How to test the changes
- Screenshots (if applicable)

## Reporting Issues

When reporting bugs, please include:
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Figma version and operating system

## Feature Requests

We welcome feature requests! Please:
- Check if the feature has already been requested
- Clearly describe the feature and its use case
- Explain how it would benefit users

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.

## License

By contributing to Type Style Sample Creator, you agree that your contributions will be licensed under the MIT License.
