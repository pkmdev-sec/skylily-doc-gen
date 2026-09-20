/**
 * Type Definitions
 * doc-gen - Skylily 🌸
 * 
 * Central type definitions for the documentation generator.
 */

/**
 * Supported source file extensions
 */
export const SUPPORTED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts', '.mjs', '.cjs'] as const;
export type SupportedExtension = typeof SUPPORTED_EXTENSIONS[number];

/**
 * Visibility levels for class members
 */
export type Visibility = 'public' | 'protected' | 'private';

/**
 * Kind of documented export
 */
export type ExportKind = 'function' | 'class' | 'interface' | 'type' | 'const' | 'variable' | 'enum';

/**
 * A documented function parameter
 */
export interface DocParam {
  /** Parameter name */
  name: string;
  /** TypeScript type as string */
  type: string;
  /** JSDoc description if available */
  description: string;
  /** Whether parameter is optional */
  optional?: boolean;
  /** Default value if available */
  defaultValue?: string;
  /** Whether parameter uses rest syntax */
  rest?: boolean;
}

/**
 * Return type documentation
 */
export interface DocReturn {
  /** TypeScript return type as string */
  type: string;
  /** JSDoc @returns description if available */
  description: string;
}

/**
 * A documented function
 */
export interface DocFunction {
  /** Function name */
  name: string;
  /** JSDoc description */
  description: string;
  /** Function parameters */
  params: DocParam[];
  /** Return type information */
  returns: DocReturn;
  /** Whether function is async */
  async: boolean;
  /** Whether function is exported */
  exported: boolean;
  /** Whether function is a generator */
  generator?: boolean;
  /** Generic type parameters */
  typeParams?: string[];
  /** Source line number (1-indexed) */
  line: number;
  /** JSDoc examples */
  examples?: string[];
  /** JSDoc @throws annotations */
  throws?: string[];
  /** JSDoc @see references */
  see?: string[];
  /** JSDoc @deprecated message */
  deprecated?: string;
  /** JSDoc @since version */
  since?: string;
}

/**
 * A documented class property
 */
export interface DocProperty {
  /** Property name */
  name: string;
  /** TypeScript type as string */
  type: string;
  /** JSDoc description */
  description: string;
  /** Visibility (public, protected, private) */
  visibility: Visibility;
  /** Whether property is static */
  static?: boolean;
  /** Whether property is readonly */
  readonly?: boolean;
  /** Whether property is optional */
  optional?: boolean;
  /** Default value if available */
  defaultValue?: string;
}

/**
 * A documented class
 */
export interface DocClass {
  /** Class name */
  name: string;
  /** JSDoc description */
  description: string;
  /** Extended class name */
  extends?: string;
  /** Implemented interface names */
  implements: string[];
  /** Class methods */
  methods: DocFunction[];
  /** Class properties */
  properties: DocProperty[];
  /** Whether class is exported */
  exported: boolean;
  /** Whether class is abstract */
  abstract?: boolean;
  /** Generic type parameters */
  typeParams?: string[];
  /** Source line number (1-indexed) */
  line: number;
  /** Constructor information */
  constructor?: DocFunction;
  /** Static methods */
  staticMethods?: DocFunction[];
  /** JSDoc @deprecated message */
  deprecated?: string;
  /** JSDoc @since version */
  since?: string;
  /** JSDoc examples */
  examples?: string[];
}

/**
 * A documented interface property
 */
export interface DocInterfaceProperty {
  /** Property name */
  name: string;
  /** TypeScript type as string */
  type: string;
  /** Whether property is optional */
  optional: boolean;
  /** JSDoc description */
  description: string;
  /** Whether property is readonly */
  readonly?: boolean;
}

/**
 * A documented interface
 */
export interface DocInterface {
  /** Interface name */
  name: string;
  /** JSDoc description */
  description: string;
  /** Interface properties */
  properties: DocInterfaceProperty[];
  /** Interface methods */
  methods?: DocFunction[];
  /** Extended interface names */
  extends?: string[];
  /** Whether interface is exported */
  exported: boolean;
  /** Generic type parameters */
  typeParams?: string[];
  /** Source line number (1-indexed) */
  line: number;
  /** JSDoc @deprecated message */
  deprecated?: string;
  /** JSDoc @since version */
  since?: string;
}

/**
 * A documented type alias
 */
export interface DocType {
  /** Type alias name */
  name: string;
  /** JSDoc description */
  description: string;
  /** Type definition as string */
  definition: string;
  /** Whether type is exported */
  exported: boolean;
  /** Generic type parameters */
  typeParams?: string[];
  /** Source line number (1-indexed) */
  line: number;
  /** JSDoc @deprecated message */
  deprecated?: string;
  /** JSDoc @since version */
  since?: string;
}

/**
 * A documented enum member
 */
export interface DocEnumMember {
  /** Member name */
  name: string;
  /** Member value */
  value: string | number;
  /** JSDoc description */
  description: string;
}

/**
 * A documented enum
 */
export interface DocEnum {
  /** Enum name */
  name: string;
  /** JSDoc description */
  description: string;
  /** Enum members */
  members: DocEnumMember[];
  /** Whether enum is exported */
  exported: boolean;
  /** Whether it's a const enum */
  const?: boolean;
  /** Source line number (1-indexed) */
  line: number;
}

/**
 * A documented export
 */
export interface DocExport {
  /** Export name */
  name: string;
  /** Kind of export */
  kind: ExportKind;
  /** JSDoc description */
  description: string;
  /** Original name if re-exported with different name */
  originalName?: string;
  /** Source module if re-exported */
  from?: string;
}

/**
 * A parsed source file with all documentation
 */
export interface ParsedFile {
  /** File path (absolute or relative) */
  path: string;
  /** Documented functions */
  functions: DocFunction[];
  /** Documented classes */
  classes: DocClass[];
  /** Documented interfaces */
  interfaces: DocInterface[];
  /** Documented type aliases */
  types: DocType[];
  /** Documented enums */
  enums?: DocEnum[];
  /** All exports */
  exports: DocExport[];
  /** Module-level JSDoc description */
  moduleDescription?: string;
  /** Parse errors (non-fatal) */
  errors?: string[];
}

/**
 * Options for the documentation generator
 */
export interface GeneratorOptions {
  /** Documentation title */
  title?: string;
  /** Include private members */
  includePrivate?: boolean;
  /** Group documentation by file instead of by type */
  groupByFile?: boolean;
  /** Include table of contents */
  includeTableOfContents?: boolean;
  /** Output format */
  format?: 'markdown' | 'html' | 'json';
  /** Base URL for links */
  baseUrl?: string;
  /** Include source code snippets */
  includeSource?: boolean;
  /** Custom template path */
  templatePath?: string;
  /** Sort order for items */
  sortOrder?: 'alphabetical' | 'source' | 'visibility';
  /** Sections to include */
  sections?: Array<'classes' | 'interfaces' | 'types' | 'functions' | 'enums'>;
}

/**
 * Options for the source file parser
 */
export interface ParserOptions {
  /** File extensions to include */
  extensions?: SupportedExtension[];
  /** Directories to exclude */
  excludeDirs?: string[];
  /** File patterns to exclude (glob) */
  excludePatterns?: string[];
  /** Include test files */
  includeTests?: boolean;
  /** Follow symlinks */
  followSymlinks?: boolean;
  /** Maximum depth for directory traversal */
  maxDepth?: number;
  /** TypeScript compiler options override */
  tsConfig?: string;
}

/**
 * Options for the CLI
 */
export interface CLIOptions extends GeneratorOptions, ParserOptions {
  /** Input path */
  inputPath: string;
  /** Output directory */
  outputDir?: string;
  /** Single file output path */
  singleFile?: string;
  /** Show help */
  help?: boolean;
  /** Show version */
  version?: boolean;
  /** Verbose output */
  verbose?: boolean;
  /** Quiet mode */
  quiet?: boolean;
  /** Watch mode */
  watch?: boolean;
}

/**
 * Result of documentation generation
 */
export interface GenerationResult {
  /** Generated documentation content */
  content: string;
  /** Output file path(s) */
  outputPaths: string[];
  /** Statistics about generated docs */
  stats: {
    filesProcessed: number;
    classesDocumented: number;
    interfacesDocumented: number;
    functionsDocumented: number;
    typesDocumented: number;
    enumsDocumented: number;
    totalExports: number;
    warnings: string[];
    errors: string[];
  };
  /** Time taken in milliseconds */
  duration: number;
}
