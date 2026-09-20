# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Custom error classes for better error handling
- Comprehensive type definitions export
- Full test suite with vitest
- Examples directory with real-world usage patterns

### Changed
- Improved TypeScript type exports

### Fixed
- None

## [0.2.0] - 2025-01-28

### Added
- **Custom Error Classes** - `FileNotFoundError`, `ParseError`, `ConfigurationError`, etc.
- **Type Exports** - All types now properly exported from package
- **Test Suite** - Comprehensive tests with 80%+ coverage target
- **Examples** - Basic usage, CLI examples, React project examples
- **Production-Ready Package** - Keywords, engines, repository in package.json
- **Contributing Guide** - Full CONTRIBUTING.md
- **Changelog** - This file!

### Changed
- Upgraded to production-grade open source quality
- Improved JSDoc documentation throughout codebase
- Better error messages with context

### Security
- No security vulnerabilities in dependencies

## [0.1.0] - 2025-01-28

### Added
- Initial release
- **CLI Tool** - `doc-gen` command for generating documentation
- **Parser** - TypeScript/JavaScript file parsing
  - Function extraction with parameters and return types
  - Class extraction with methods and properties
  - Interface extraction with properties
  - Type alias extraction
  - JSDoc comment parsing
- **Generator** - Markdown documentation generation
  - Table of contents
  - Class documentation with inheritance
  - Interface documentation with property tables
  - Function documentation with signatures
  - Type documentation with definitions
- **Options**
  - Custom output directory
  - Single file output
  - Custom title
  - Include private members
  - Group by file
  - Disable table of contents
- **Directory Scanning** - Recursive file discovery
  - Automatic exclusion of node_modules, dist, etc.
  - Configurable file extensions

### Technical
- Built with TypeScript 5.3+
- Node.js 18+ required
- ESM module format

---

## Release Notes Format

### Added
New features and capabilities.

### Changed
Changes in existing functionality.

### Deprecated
Features that will be removed in future versions.

### Removed
Features that have been removed.

### Fixed
Bug fixes.

### Security
Security-related changes and vulnerability fixes.

---

[Unreleased]: https://github.com/pkmdev-sec/skylily-doc-gen/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/pkmdev-sec/skylily-doc-gen/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/pkmdev-sec/skylily-doc-gen/releases/tag/v0.1.0
