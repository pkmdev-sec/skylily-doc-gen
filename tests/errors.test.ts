/**
 * Error Classes Tests
 * doc-gen - Skylily 🌸
 */

import { describe, it, expect } from 'vitest';
import {
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
} from '../src/errors.js';

describe('Error Classes', () => {
  describe('DocGenError', () => {
    it('should create error with message and code', () => {
      const error = new DocGenError('Something went wrong', 'TEST_ERROR');
      
      expect(error.message).toBe('Something went wrong');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('DocGenError');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DocGenError);
    });
    
    it('should include context', () => {
      const context = { file: 'test.ts', line: 42 };
      const error = new DocGenError('Error', 'TEST', context);
      
      expect(error.context).toEqual(context);
    });
    
    it('should serialize to JSON', () => {
      const error = new DocGenError('Test', 'CODE', { key: 'value' });
      const json = error.toJSON();
      
      expect(json.name).toBe('DocGenError');
      expect(json.message).toBe('Test');
      expect(json.code).toBe('CODE');
      expect(json.context).toEqual({ key: 'value' });
      expect(json.stack).toBeDefined();
    });
  });
  
  describe('FileNotFoundError', () => {
    it('should create error with file path', () => {
      const error = new FileNotFoundError('/path/to/file.ts');
      
      expect(error.message).toBe('File not found: /path/to/file.ts');
      expect(error.code).toBe('FILE_NOT_FOUND');
      expect(error.filePath).toBe('/path/to/file.ts');
      expect(error.name).toBe('FileNotFoundError');
    });
  });
  
  describe('DirectoryNotFoundError', () => {
    it('should create error with directory path', () => {
      const error = new DirectoryNotFoundError('/path/to/dir');
      
      expect(error.message).toBe('Directory not found: /path/to/dir');
      expect(error.code).toBe('DIRECTORY_NOT_FOUND');
      expect(error.dirPath).toBe('/path/to/dir');
      expect(error.name).toBe('DirectoryNotFoundError');
    });
  });
  
  describe('ParseError', () => {
    it('should create error with file path and message', () => {
      const error = new ParseError('/test.ts', 'Unexpected token');
      
      expect(error.message).toBe('Failed to parse /test.ts: Unexpected token');
      expect(error.code).toBe('PARSE_ERROR');
      expect(error.filePath).toBe('/test.ts');
      expect(error.name).toBe('ParseError');
    });
    
    it('should include line and column', () => {
      const error = new ParseError('/test.ts', 'Syntax error', { line: 10, column: 5 });
      
      expect(error.message).toBe('Failed to parse /test.ts at line 10:5: Syntax error');
      expect(error.line).toBe(10);
      expect(error.column).toBe(5);
    });
    
    it('should include cause', () => {
      const cause = new Error('Original error');
      const error = new ParseError('/test.ts', 'Parse failed', { cause });
      
      expect(error.cause).toBe(cause);
    });
  });
  
  describe('UnsupportedFileTypeError', () => {
    it('should create error with extension info', () => {
      const error = new UnsupportedFileTypeError('/file.py', '.py', ['.ts', '.js']);
      
      expect(error.message).toContain('.py');
      expect(error.message).toContain('.ts, .js');
      expect(error.code).toBe('UNSUPPORTED_FILE_TYPE');
      expect(error.filePath).toBe('/file.py');
      expect(error.extension).toBe('.py');
      expect(error.supportedExtensions).toEqual(['.ts', '.js']);
    });
  });
  
  describe('OutputError', () => {
    it('should create error with output path', () => {
      const error = new OutputError('/output/docs.md', 'Permission denied');
      
      expect(error.message).toBe('Failed to write output to /output/docs.md: Permission denied');
      expect(error.code).toBe('OUTPUT_ERROR');
      expect(error.outputPath).toBe('/output/docs.md');
    });
    
    it('should include cause', () => {
      const cause = new Error('EACCES');
      const error = new OutputError('/output.md', 'Write failed', cause);
      
      expect(error.cause).toBe(cause);
    });
  });
  
  describe('ConfigurationError', () => {
    it('should create error with message', () => {
      const error = new ConfigurationError('Invalid configuration');
      
      expect(error.message).toBe('Invalid configuration');
      expect(error.code).toBe('CONFIGURATION_ERROR');
      expect(error.name).toBe('ConfigurationError');
    });
    
    it('should include config details', () => {
      const error = new ConfigurationError('Invalid timeout', {
        configKey: 'timeout',
        expectedType: 'number',
        receivedValue: 'abc',
      });
      
      expect(error.configKey).toBe('timeout');
      expect(error.expectedType).toBe('number');
      expect(error.receivedValue).toBe('abc');
    });
  });
  
  describe('NoSourceFilesError', () => {
    it('should create error with search info', () => {
      const error = new NoSourceFilesError('/src', ['.ts', '.tsx']);
      
      expect(error.message).toContain('/src');
      expect(error.message).toContain('.ts, .tsx');
      expect(error.code).toBe('NO_SOURCE_FILES');
      expect(error.searchPath).toBe('/src');
      expect(error.extensions).toEqual(['.ts', '.tsx']);
    });
  });
  
  describe('TypeScriptError', () => {
    it('should create error with diagnostics', () => {
      const diagnostics = ['Error 1', 'Error 2'];
      const error = new TypeScriptError('TypeScript compilation failed', diagnostics);
      
      expect(error.message).toBe('TypeScript compilation failed');
      expect(error.code).toBe('TYPESCRIPT_ERROR');
      expect(error.diagnostics).toEqual(diagnostics);
    });
  });
  
  describe('isDocGenError', () => {
    it('should return true for DocGenError instances', () => {
      expect(isDocGenError(new DocGenError('test', 'TEST'))).toBe(true);
      expect(isDocGenError(new FileNotFoundError('/test'))).toBe(true);
      expect(isDocGenError(new ParseError('/test', 'error'))).toBe(true);
    });
    
    it('should return false for non-DocGenError', () => {
      expect(isDocGenError(new Error('test'))).toBe(false);
      expect(isDocGenError('string error')).toBe(false);
      expect(isDocGenError(null)).toBe(false);
      expect(isDocGenError(undefined)).toBe(false);
      expect(isDocGenError(42)).toBe(false);
    });
  });
  
  describe('formatError', () => {
    it('should format FileNotFoundError', () => {
      const error = new FileNotFoundError('/missing.ts');
      const formatted = formatError(error);
      
      expect(formatted).toContain('/missing.ts');
      expect(formatted).toContain('check the path');
    });
    
    it('should format DirectoryNotFoundError', () => {
      const error = new DirectoryNotFoundError('/missing-dir');
      const formatted = formatError(error);
      
      expect(formatted).toContain('/missing-dir');
      expect(formatted).toContain('check the path');
    });
    
    it('should format ParseError with location', () => {
      const error = new ParseError('/file.ts', 'Syntax error', { line: 10, column: 5 });
      const formatted = formatError(error);
      
      expect(formatted).toContain('/file.ts');
      expect(formatted).toContain('line 10');
      expect(formatted).toContain(':5');
    });
    
    it('should format UnsupportedFileTypeError', () => {
      const error = new UnsupportedFileTypeError('/file.py', '.py', ['.ts']);
      const formatted = formatError(error);
      
      expect(formatted).toContain('.py');
      expect(formatted).toContain('.ts');
    });
    
    it('should format NoSourceFilesError', () => {
      const error = new NoSourceFilesError('/empty', ['.ts']);
      const formatted = formatError(error);
      
      expect(formatted).toContain('/empty');
      expect(formatted).toContain('.ts');
    });
    
    it('should format generic Error', () => {
      const error = new Error('Something broke');
      const formatted = formatError(error);
      
      expect(formatted).toBe('Something broke');
    });
    
    it('should format string errors', () => {
      const formatted = formatError('String error message');
      
      expect(formatted).toBe('String error message');
    });
  });
});
