/**
 * skylily-doc-gen
 * 🌸 Skylily
 * 
 * Generate comprehensive documentation from any TypeScript/JavaScript codebase.
 * 
 * @packageDocumentation
 * @module skylily-doc-gen
 * 
 * @example
 * ```typescript
 * import { parseFile, findSourceFiles, generateDocumentation } from 'skylily-doc-gen';
 * 
 * // Parse all files in a directory
 * const files = findSourceFiles('./src');
 * const parsed = files.map(file => parseFile(file));
 * 
 * // Generate documentation
 * const docs = generateDocumentation(parsed, {
 *   title: 'My API Documentation',
 *   includeTableOfContents: true,
 * });
 * 
 * console.log(docs);
 * ```
 */

// Core functionality
export {
  parseFile,
  findSourceFiles,
  type ParsedFile,
  type DocFunction,
  type DocClass,
  type DocInterface,
  type DocType,
  type DocExport,
} from './parser.js';

export {
  generateDocumentation,
  type GeneratorOptions,
} from './generator.js';

// Error classes
export {
  DocGenError,
  FileNotFoundError,
  DirectoryNotFoundError,
  ParseError,
  UnsupportedFileTypeError,
  OutputError,
  ConfigurationError,
  NoSourceFilesError,
  TypeScriptError,
  isDocGenError,
  formatError,
} from './errors.js';

// Type definitions
export {
  SUPPORTED_EXTENSIONS,
  type SupportedExtension,
  type Visibility,
  type ExportKind,
  type DocParam,
  type DocReturn,
  type DocProperty,
  type DocInterfaceProperty,
  type DocEnumMember,
  type DocEnum,
  type ParserOptions,
  type CLIOptions,
  type GenerationResult,
} from './types.js';

// Version
export const VERSION = '0.2.0';
