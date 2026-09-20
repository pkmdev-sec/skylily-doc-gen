# skylily-doc-gen 📚

[![npm version](https://img.shields.io/npm/v/skylily-doc-gen.svg)](https://www.npmjs.com/package/skylily-doc-gen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)]()
[![Coverage](https://img.shields.io/badge/coverage-80%25+-brightgreen.svg)]()

> **Generate comprehensive documentation from any TypeScript/JavaScript codebase.**
>
> 🌸 *Built with love by Skylily*

---

## ✨ Features

- 📝 **Automatic Documentation** - Extracts JSDoc comments, types, and signatures
- 🔍 **TypeScript-First** - Full support for TypeScript types, interfaces, and generics
- 📁 **Directory Scanning** - Recursively finds all source files
- 🎨 **Markdown Output** - Clean, readable markdown documentation
- 🛠️ **CLI & API** - Use from command line or programmatically
- ⚡ **Fast** - Built on TypeScript compiler for accurate parsing
- 🔧 **Configurable** - Customize output format, grouping, and content
- 📦 **Zero Config** - Works out of the box with sensible defaults

---

## 📦 Installation

### Global Installation (CLI)

```bash
npm install -g skylily-doc-gen
```

### Local Installation (Project)

```bash
npm install skylily-doc-gen --save-dev
```

### Using npx (No Installation)

```bash
npx skylily-doc-gen ./src
```

---

## 🚀 Quick Start

### CLI Usage

Generate documentation for your project in seconds:

```bash
# Generate docs for src directory
doc-gen ./src

# Output to custom directory
doc-gen ./src --output ./documentation

# Single file output with custom title
doc-gen ./src --single API.md --title "My API Reference"
```

### Programmatic Usage

```typescript
import { parseFile, findSourceFiles, generateDocumentation } from 'skylily-doc-gen';

// Find all source files
const files = findSourceFiles('./src');

// Parse each file
const parsed = files.map(file => parseFile(file));

// Generate documentation
const docs = generateDocumentation(parsed, {
  title: 'My API Documentation',
  includeTableOfContents: true,
});

console.log(docs);
```

---

## 📖 CLI Reference

```
📚 doc-gen
Generate documentation from your codebase

Usage:
  doc-gen <path>                     Generate docs from path
  doc-gen <path> --output <dir>      Output to directory
  doc-gen <path> --single <file>     Single file output

Options:
  --output, -o <dir>    Output directory (default: docs/)
  --single, -s <file>   Single file output
  --title <title>       Documentation title
  --private             Include private members
  --by-file             Group by file instead of type
  --no-toc              Disable table of contents
  --help, -h            Show this help

Examples:
  doc-gen ./src
  doc-gen ./src --output docs/
  doc-gen ./src --single API.md --title "My API"
  doc-gen ./src --private --by-file
```

---

## 🔧 Configuration Options

### GeneratorOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `"API Documentation"` | Title for the generated docs |
| `includePrivate` | `boolean` | `false` | Include private class members |
| `groupByFile` | `boolean` | `false` | Group docs by file instead of type |
| `includeTableOfContents` | `boolean` | `true` | Generate table of contents |
| `format` | `string` | `"markdown"` | Output format |
| `sortOrder` | `string` | `"alphabetical"` | Sort order for items |

### ParserOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `extensions` | `string[]` | `['.ts', '.tsx', '.js', '.jsx']` | File extensions to include |
| `excludeDirs` | `string[]` | `['node_modules', 'dist', ...]` | Directories to exclude |
| `includeTests` | `boolean` | `false` | Include test files |
| `maxDepth` | `number` | `Infinity` | Max directory depth |

---

## 📚 API Documentation

### Core Functions

#### `parseFile(filePath: string): ParsedFile`

Parses a single TypeScript/JavaScript file and extracts documentation.

```typescript
import { parseFile } from 'skylily-doc-gen';

const parsed = parseFile('./src/utils.ts');

console.log(parsed.functions);   // Array of documented functions
console.log(parsed.classes);     // Array of documented classes
console.log(parsed.interfaces);  // Array of documented interfaces
console.log(parsed.types);       // Array of documented type aliases
```

**Returns:** `ParsedFile` object containing:
- `path` - File path
- `functions` - Array of `DocFunction`
- `classes` - Array of `DocClass`
- `interfaces` - Array of `DocInterface`
- `types` - Array of `DocType`
- `exports` - Array of `DocExport`

---

#### `findSourceFiles(dir: string, extensions?: string[]): string[]`

Recursively finds all source files in a directory.

```typescript
import { findSourceFiles } from 'skylily-doc-gen';

// Find all TypeScript files
const tsFiles = findSourceFiles('./src', ['.ts', '.tsx']);

// Find all source files (default extensions)
const allFiles = findSourceFiles('./src');
```

**Parameters:**
- `dir` - Directory to search
- `extensions` - File extensions to include (optional)

**Returns:** Array of absolute file paths

**Note:** Automatically excludes:
- `node_modules`
- `.git`
- `dist`, `build`
- `coverage`
- `.next`

---

#### `generateDocumentation(files: ParsedFile[], options?: GeneratorOptions): string`

Generates markdown documentation from parsed files.

```typescript
import { generateDocumentation } from 'skylily-doc-gen';

const docs = generateDocumentation(parsedFiles, {
  title: 'My API',
  includePrivate: false,
  groupByFile: true,
  includeTableOfContents: true,
});
```

**Parameters:**
- `files` - Array of `ParsedFile` objects from `parseFile()`
- `options` - Generator options (optional)

**Returns:** Markdown string

---

### Type Definitions

#### `DocFunction`

```typescript
interface DocFunction {
  name: string;
  description: string;
  params: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  returns: {
    type: string;
    description: string;
  };
  async: boolean;
  exported: boolean;
  line: number;
}
```

#### `DocClass`

```typescript
interface DocClass {
  name: string;
  description: string;
  extends?: string;
  implements: string[];
  methods: DocFunction[];
  properties: Array<{
    name: string;
    type: string;
    description: string;
    visibility: 'public' | 'protected' | 'private';
  }>;
  exported: boolean;
  line: number;
}
```

#### `DocInterface`

```typescript
interface DocInterface {
  name: string;
  description: string;
  properties: Array<{
    name: string;
    type: string;
    optional: boolean;
    description: string;
  }>;
  exported: boolean;
  line: number;
}
```

#### `DocType`

```typescript
interface DocType {
  name: string;
  description: string;
  definition: string;
  exported: boolean;
  line: number;
}
```

---

## 📝 Example Output

Given this TypeScript code:

```typescript
/**
 * User management service
 */
export class UserService {
  /**
   * Creates a new user
   * @param email - User's email address
   * @param name - User's display name
   * @returns The created user
   */
  async createUser(email: string, name: string): Promise<User> {
    // ...
  }
}

/**
 * Represents a user in the system
 */
export interface User {
  /** Unique identifier */
  id: string;
  /** Email address */
  email: string;
  /** Display name */
  name: string;
}
```

doc-gen generates:

```markdown
# API Documentation

## Table of Contents

### Classes
- [`UserService`](#userservice)

### Interfaces
- [`User`](#user)

---

## Classes

### `UserService`

User management service

#### Methods

#### `createUser`

Creates a new user

\`\`\`typescript
async createUser(email: string, name: string): Promise<User>
\`\`\`

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `email` | `string` | User's email address |
| `name` | `string` | User's display name |

**Returns:** `Promise<User>` - The created user

---

## Interfaces

### `User`

Represents a user in the system

| Property | Type | Optional | Description |
|----------|------|----------|-------------|
| `id` | `string` |  | Unique identifier |
| `email` | `string` |  | Email address |
| `name` | `string` |  | Display name |
```

---

## 🎯 Use Cases

### Generate API Documentation

```bash
doc-gen ./src/api --single API.md --title "REST API Reference"
```

### Generate Component Documentation

```bash
doc-gen ./src/components --output ./docs/components --by-file
```

### CI/CD Integration

```yaml
# .github/workflows/docs.yml
name: Generate Docs
on: [push]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx doc-gen ./src --single docs/API.md
      - uses: actions/upload-artifact@v4
        with:
          name: documentation
          path: docs/
```

### npm Scripts

```json
{
  "scripts": {
    "docs": "doc-gen ./src --output ./docs",
    "docs:api": "doc-gen ./src/api --single API.md",
    "docs:watch": "nodemon -w src -e ts --exec 'npm run docs'"
  }
}
```

---

## 🔌 Integration Examples

### With TypeDoc

Use doc-gen for quick inline docs, TypeDoc for full reference:

```json
{
  "scripts": {
    "docs:quick": "doc-gen ./src --single QUICK_REF.md",
    "docs:full": "typedoc --out docs/api src/"
  }
}
```

### With Docusaurus

```bash
# Generate docs for Docusaurus
doc-gen ./src --single docs/api/reference.md --title "API Reference"
```

### With VitePress

```bash
# Generate for VitePress docs
doc-gen ./src --output docs/api --by-file
```

---

## 🛠️ Error Handling

doc-gen provides detailed error classes for programmatic use:

```typescript
import { 
  parseFile,
  FileNotFoundError,
  ParseError,
  isDocGenError,
  formatError 
} from 'skylily-doc-gen';

try {
  const parsed = parseFile('./nonexistent.ts');
} catch (error) {
  if (error instanceof FileNotFoundError) {
    console.error(`File not found: ${error.filePath}`);
  } else if (error instanceof ParseError) {
    console.error(`Parse error at line ${error.line}: ${error.message}`);
  } else if (isDocGenError(error)) {
    console.error(`doc-gen error [${error.code}]: ${error.message}`);
  } else {
    console.error(formatError(error));
  }
}
```

### Error Types

| Error Class | Code | Description |
|-------------|------|-------------|
| `FileNotFoundError` | `FILE_NOT_FOUND` | File doesn't exist |
| `DirectoryNotFoundError` | `DIRECTORY_NOT_FOUND` | Directory doesn't exist |
| `ParseError` | `PARSE_ERROR` | Failed to parse file |
| `UnsupportedFileTypeError` | `UNSUPPORTED_FILE_TYPE` | Invalid file extension |
| `OutputError` | `OUTPUT_ERROR` | Failed to write output |
| `ConfigurationError` | `CONFIGURATION_ERROR` | Invalid configuration |
| `NoSourceFilesError` | `NO_SOURCE_FILES` | No files found |

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

---

## 📊 Performance

doc-gen is optimized for speed:

| Project Size | Files | Time |
|-------------|-------|------|
| Small (< 50 files) | 50 | ~1s |
| Medium (50-200 files) | 200 | ~3s |
| Large (200-500 files) | 500 | ~7s |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Clone the repo
git clone https://github.com/pkmdev-sec/skylily-doc-gen.git

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

---

## 📄 License

MIT © [Skylily](https://github.com/pkmdev-sec)

See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Built with the [TypeScript Compiler API](https://github.com/microsoft/TypeScript)
- Inspired by [TypeDoc](https://typedoc.org/), [JSDoc](https://jsdoc.app/), and [documentation.js](https://documentation.js.org/)

---

## 📞 Support

- 🐛 [Report a bug](https://github.com/pkmdev-sec/skylily-doc-gen/issues/new?template=bug_report.md)
- 💡 [Request a feature](https://github.com/pkmdev-sec/skylily-doc-gen/issues/new?template=feature_request.md)
- 💬 [Ask a question](https://github.com/pkmdev-sec/skylily-doc-gen/discussions)

---

<p align="center">
  Made with 💜 by <a href="https://github.com/pkmdev-sec">Skylily 🌸</a>
</p>
