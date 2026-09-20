/**
 * Custom Error Classes
 * doc-gen - Skylily 🌸
 * 
 * Provides structured error handling for the documentation generator.
 */

/**
 * Base error class for all doc-gen errors
 */
export class DocGenError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;
  
  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'DocGenError';
    this.code = code;
    this.context = context;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Thrown when a file cannot be found or accessed
 */
export class FileNotFoundError extends DocGenError {
  public readonly filePath: string;
  
  constructor(filePath: string) {
    super(`File not found: ${filePath}`, 'FILE_NOT_FOUND', { filePath });
    this.name = 'FileNotFoundError';
    this.filePath = filePath;
  }
}

/**
 * Thrown when a directory cannot be found or accessed
 */
export class DirectoryNotFoundError extends DocGenError {
  public readonly dirPath: string;
  
  constructor(dirPath: string) {
    super(`Directory not found: ${dirPath}`, 'DIRECTORY_NOT_FOUND', { dirPath });
    this.name = 'DirectoryNotFoundError';
    this.dirPath = dirPath;
  }
}

/**
 * Thrown when parsing a source file fails
 */
export class ParseError extends DocGenError {
  public readonly filePath: string;
  public readonly line?: number;
  public readonly column?: number;
  public readonly cause?: Error;
  
  constructor(
    filePath: string, 
    message: string,
    options?: { line?: number; column?: number; cause?: Error }
  ) {
    const location = options?.line 
      ? ` at line ${options.line}${options.column ? `:${options.column}` : ''}`
      : '';
    super(
      `Failed to parse ${filePath}${location}: ${message}`,
      'PARSE_ERROR',
      { filePath, line: options?.line, column: options?.column }
    );
    this.name = 'ParseError';
    this.filePath = filePath;
    this.line = options?.line;
    this.column = options?.column;
    this.cause = options?.cause;
  }
}

/**
 * Thrown when an unsupported file type is encountered
 */
export class UnsupportedFileTypeError extends DocGenError {
  public readonly filePath: string;
  public readonly extension: string;
  public readonly supportedExtensions: string[];
  
  constructor(filePath: string, extension: string, supportedExtensions: string[]) {
    super(
      `Unsupported file type: ${extension}. Supported types: ${supportedExtensions.join(', ')}`,
      'UNSUPPORTED_FILE_TYPE',
      { filePath, extension, supportedExtensions }
    );
    this.name = 'UnsupportedFileTypeError';
    this.filePath = filePath;
    this.extension = extension;
    this.supportedExtensions = supportedExtensions;
  }
}

/**
 * Thrown when writing output fails
 */
export class OutputError extends DocGenError {
  public readonly outputPath: string;
  public readonly cause?: Error;
  
  constructor(outputPath: string, message: string, cause?: Error) {
    super(`Failed to write output to ${outputPath}: ${message}`, 'OUTPUT_ERROR', { outputPath });
    this.name = 'OutputError';
    this.outputPath = outputPath;
    this.cause = cause;
  }
}

/**
 * Thrown when configuration is invalid
 */
export class ConfigurationError extends DocGenError {
  public readonly configKey?: string;
  public readonly expectedType?: string;
  public readonly receivedValue?: unknown;
  
  constructor(
    message: string,
    options?: { configKey?: string; expectedType?: string; receivedValue?: unknown }
  ) {
    super(message, 'CONFIGURATION_ERROR', options);
    this.name = 'ConfigurationError';
    this.configKey = options?.configKey;
    this.expectedType = options?.expectedType;
    this.receivedValue = options?.receivedValue;
  }
}

/**
 * Thrown when no source files are found
 */
export class NoSourceFilesError extends DocGenError {
  public readonly searchPath: string;
  public readonly extensions: string[];
  
  constructor(searchPath: string, extensions: string[]) {
    super(
      `No source files found in ${searchPath} with extensions: ${extensions.join(', ')}`,
      'NO_SOURCE_FILES',
      { searchPath, extensions }
    );
    this.name = 'NoSourceFilesError';
    this.searchPath = searchPath;
    this.extensions = extensions;
  }
}

/**
 * Thrown when TypeScript compilation fails
 */
export class TypeScriptError extends DocGenError {
  public readonly diagnostics: string[];
  
  constructor(message: string, diagnostics: string[]) {
    super(message, 'TYPESCRIPT_ERROR', { diagnostics });
    this.name = 'TypeScriptError';
    this.diagnostics = diagnostics;
  }
}

/**
 * Type guard to check if an error is a DocGenError
 */
export function isDocGenError(error: unknown): error is DocGenError {
  return error instanceof DocGenError;
}

/**
 * Get a user-friendly error message
 */
export function formatError(error: unknown): string {
  if (error instanceof FileNotFoundError) {
    return `Could not find file: ${error.filePath}\nPlease check the path exists and is accessible.`;
  }
  
  if (error instanceof DirectoryNotFoundError) {
    return `Could not find directory: ${error.dirPath}\nPlease check the path exists and is accessible.`;
  }
  
  if (error instanceof ParseError) {
    let msg = `Error parsing ${error.filePath}`;
    if (error.line) {
      msg += ` at line ${error.line}`;
      if (error.column) msg += `:${error.column}`;
    }
    msg += `\n${error.message}`;
    return msg;
  }
  
  if (error instanceof UnsupportedFileTypeError) {
    return `File type '${error.extension}' is not supported.\nSupported types: ${error.supportedExtensions.join(', ')}`;
  }
  
  if (error instanceof NoSourceFilesError) {
    return `No source files found in: ${error.searchPath}\nLooking for files with extensions: ${error.extensions.join(', ')}`;
  }
  
  if (error instanceof ConfigurationError) {
    return `Configuration error: ${error.message}`;
  }
  
  if (error instanceof OutputError) {
    return `Could not write output to: ${error.outputPath}\n${error.message}`;
  }
  
  if (isDocGenError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return String(error);
}
