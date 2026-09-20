/**
 * Source Code Parser
 * doc-gen - Skylily 🌸
 *
 * Parses TypeScript/JavaScript files to extract documentation.
 */
export interface DocFunction {
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
export interface DocClass {
    name: string;
    description: string;
    extends?: string;
    implements: string[];
    methods: DocFunction[];
    properties: Array<{
        name: string;
        type: string;
        description: string;
        visibility: string;
    }>;
    exported: boolean;
    line: number;
}
export interface DocInterface {
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
export interface DocType {
    name: string;
    description: string;
    definition: string;
    exported: boolean;
    line: number;
}
export interface DocExport {
    name: string;
    kind: 'function' | 'class' | 'interface' | 'type' | 'const' | 'variable';
    description: string;
}
export interface ParsedFile {
    path: string;
    functions: DocFunction[];
    classes: DocClass[];
    interfaces: DocInterface[];
    types: DocType[];
    exports: DocExport[];
}
/**
 * Parse a TypeScript/JavaScript file
 */
export declare function parseFile(filePath: string): ParsedFile;
/**
 * Find all source files in a directory
 */
export declare function findSourceFiles(dir: string, extensions?: string[]): string[];
//# sourceMappingURL=parser.d.ts.map