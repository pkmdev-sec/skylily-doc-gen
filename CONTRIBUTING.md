# Contributing to skylily-doc-gen

First off, thank you for considering contributing to skylily-doc-gen! 🌸

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming, inclusive environment. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

**When reporting a bug, include:**

1. **Clear title** - Summarize the issue
2. **Steps to reproduce** - Detailed steps to reproduce the behavior
3. **Expected behavior** - What you expected to happen
4. **Actual behavior** - What actually happened
5. **Environment** - Node.js version, OS, doc-gen version
6. **Code sample** - Minimal code that reproduces the issue

**Bug Report Template:**

```markdown
### Description
A clear description of the bug.

### Steps to Reproduce
1. Run `doc-gen ./src`
2. See error

### Expected Behavior
Documentation should be generated.

### Actual Behavior
Error: "Cannot read property..."

### Environment
- doc-gen version: 0.1.0
- Node.js version: 20.0.0
- OS: macOS 14.0

### Code Sample
```typescript
// Minimal reproduction code
```
```

### Suggesting Features

Feature requests are welcome! Please provide:

1. **Use case** - Why do you need this feature?
2. **Proposed solution** - How should it work?
3. **Alternatives** - Other solutions you've considered
4. **Examples** - Code examples if applicable

### Pull Requests

We love pull requests! Here's how to contribute code:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/skylily-doc-gen.git
cd skylily-doc-gen

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Project Structure

```
skylily-doc-gen/
├── src/
│   ├── index.ts      # Main exports
│   ├── cli.ts        # CLI implementation
│   ├── parser.ts     # TypeScript parser
│   ├── generator.ts  # Markdown generator
│   ├── errors.ts     # Custom error classes
│   └── types.ts      # Type definitions
├── tests/
│   ├── parser.test.ts
│   ├── generator.test.ts
│   ├── errors.test.ts
│   └── integration.test.ts
├── examples/
│   ├── basic-usage/
│   ├── advanced-usage/
│   └── react-project/
└── docs/
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build TypeScript to JavaScript |
| `npm run dev` | Build in watch mode |
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint the codebase |
| `npm run lint:fix` | Fix linting issues |

## Pull Request Process

### Before Submitting

1. **Update documentation** - Update README.md if needed
2. **Add tests** - New features need tests
3. **Update CHANGELOG** - Add entry under "Unreleased"
4. **Run checks** - Ensure `npm test` and `npm run lint` pass

### PR Title Format

Use conventional commit format:

- `feat: Add HTML output format`
- `fix: Handle empty files correctly`
- `docs: Improve API documentation`
- `test: Add parser edge cases`
- `chore: Update dependencies`
- `refactor: Simplify generator logic`

### PR Description Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes.

## Checklist
- [ ] I have read CONTRIBUTING.md
- [ ] My code follows the style guidelines
- [ ] I have added tests for new functionality
- [ ] All tests pass locally
- [ ] I have updated documentation as needed
- [ ] I have added a CHANGELOG entry
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged!

## Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use explicit return types for functions
- Use meaningful variable names
- Add JSDoc comments for public APIs

```typescript
// Good
/**
 * Parses a TypeScript file and extracts documentation.
 * @param filePath - Path to the file to parse
 * @returns Parsed documentation object
 * @throws {FileNotFoundError} If file doesn't exist
 */
export function parseFile(filePath: string): ParsedFile {
  // ...
}

// Bad
export function parse(f: any) {
  // ...
}
```

### Code Organization

- One export per file for main modules
- Group related utilities together
- Keep files under 500 lines
- Use barrel exports (index.ts)

### Error Handling

- Use custom error classes from `errors.ts`
- Include helpful error messages
- Add context to errors when possible

```typescript
// Good
throw new FileNotFoundError(filePath);

// Bad
throw new Error('File not found');
```

## Testing

### Writing Tests

- Use descriptive test names
- Test edge cases
- Mock external dependencies
- Aim for 80%+ coverage

```typescript
describe('parseFile', () => {
  it('should parse a function with JSDoc', () => {
    // ...
  });

  it('should handle files with no exports', () => {
    // ...
  });

  it('should throw FileNotFoundError for missing files', () => {
    // ...
  });
});
```

### Test Structure

```typescript
describe('Module', () => {
  describe('function', () => {
    it('should do something when condition', () => {
      // Arrange
      const input = '...';

      // Act
      const result = myFunction(input);

      // Assert
      expect(result).toBe('...');
    });
  });
});
```

## Documentation

### JSDoc Comments

Add JSDoc to all public APIs:

```typescript
/**
 * Brief description of the function.
 *
 * Longer description if needed.
 *
 * @param param1 - Description of param1
 * @param param2 - Description of param2
 * @returns Description of return value
 * @throws {ErrorType} When this error occurs
 *
 * @example
 * ```typescript
 * const result = myFunction('input');
 * console.log(result); // 'output'
 * ```
 */
export function myFunction(param1: string, param2: number): string {
  // ...
}
```

### README Updates

When adding features:

1. Add to "Features" list if significant
2. Add usage example
3. Update API documentation
4. Add to changelog

## Questions?

Feel free to open an issue or discussion if you have questions!

---

Thank you for contributing! 🌸
