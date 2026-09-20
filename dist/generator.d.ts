/**
 * Documentation Generator
 * doc-gen - Skylily 🌸
 *
 * Generates markdown documentation from parsed files.
 */
import { ParsedFile } from './parser.js';
export interface GeneratorOptions {
    title?: string;
    includePrivate?: boolean;
    groupByFile?: boolean;
    includeTableOfContents?: boolean;
}
/**
 * Generate full documentation from parsed files
 */
export declare function generateDocumentation(files: ParsedFile[], options?: GeneratorOptions): string;
//# sourceMappingURL=generator.d.ts.map