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
export { parseFile, findSourceFiles, } from './parser.js';
export { generateDocumentation, } from './generator.js';
// Error classes
export { DocGenError, FileNotFoundError, DirectoryNotFoundError, ParseError, UnsupportedFileTypeError, OutputError, ConfigurationError, NoSourceFilesError, TypeScriptError, isDocGenError, formatError, } from './errors.js';
// Type definitions
export { SUPPORTED_EXTENSIONS, } from './types.js';
// Version
export const VERSION = '0.2.0';
//# sourceMappingURL=index.js.map