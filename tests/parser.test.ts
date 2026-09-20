/**
 * Parser Tests
 * doc-gen - Skylily 🌸
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { parseFile, findSourceFiles } from '../src/parser.js';

describe('Parser', () => {
  const tempDir = path.join(os.tmpdir(), 'doc-gen-test-' + Date.now());
  
  beforeAll(() => {
    fs.mkdirSync(tempDir, { recursive: true });
  });
  
  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  describe('parseFile', () => {
    it('should parse a simple function', () => {
      const filePath = path.join(tempDir, 'simple-function.ts');
      fs.writeFileSync(filePath, `
/**
 * Adds two numbers together
 */
export function add(a: number, b: number): number {
  return a + b;
}
      `);
      
      const result = parseFile(filePath);
      
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].name).toBe('add');
      expect(result.functions[0].description).toBe('Adds two numbers together');
      expect(result.functions[0].params).toHaveLength(2);
      expect(result.functions[0].params[0].name).toBe('a');
      expect(result.functions[0].params[0].type).toBe('number');
      expect(result.functions[0].returns.type).toBe('number');
      expect(result.functions[0].exported).toBe(true);
      expect(result.functions[0].async).toBe(false);
    });
    
    it('should parse an async function', () => {
      const filePath = path.join(tempDir, 'async-function.ts');
      fs.writeFileSync(filePath, `
/**
 * Fetches data from the API
 */
export async function fetchData(url: string): Promise<string> {
  return '';
}
      `);
      
      const result = parseFile(filePath);
      
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].name).toBe('fetchData');
      expect(result.functions[0].async).toBe(true);
    });
    
    it('should parse a class with methods and properties', () => {
      const filePath = path.join(tempDir, 'class.ts');
      fs.writeFileSync(filePath, `
/**
 * A user in the system
 */
export class User {
  /** User's unique identifier */
  public id: string;
  
  /** User's email address */
  private email: string;
  
  /**
   * Creates a new user
   */
  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }
  
  /**
   * Gets the user's display name
   */
  public getDisplayName(): string {
    return this.id;
  }
  
  /**
   * Internal method
   */
  private _validate(): boolean {
    return true;
  }
}
      `);
      
      const result = parseFile(filePath);
      
      expect(result.classes).toHaveLength(1);
      const cls = result.classes[0];
      expect(cls.name).toBe('User');
      expect(cls.description).toBe('A user in the system');
      expect(cls.properties.length).toBeGreaterThanOrEqual(2);
      expect(cls.methods.length).toBeGreaterThanOrEqual(1);
      expect(cls.exported).toBe(true);
    });
    
    it('should parse a class with extends and implements', () => {
      const filePath = path.join(tempDir, 'class-extends.ts');
      fs.writeFileSync(filePath, `
interface Identifiable {
  id: string;
}

class BaseEntity {
  createdAt: Date = new Date();
}

/**
 * A document entity
 */
export class Document extends BaseEntity implements Identifiable {
  id: string = '';
  title: string = '';
}
      `);
      
      const result = parseFile(filePath);
      
      const docClass = result.classes.find(c => c.name === 'Document');
      expect(docClass).toBeDefined();
      expect(docClass!.extends).toBe('BaseEntity');
      expect(docClass!.implements).toContain('Identifiable');
    });
    
    it('should parse an interface', () => {
      const filePath = path.join(tempDir, 'interface.ts');
      fs.writeFileSync(filePath, `
/**
 * Configuration options
 */
export interface Config {
  /** API endpoint URL */
  apiUrl: string;
  /** Request timeout in ms */
  timeout?: number;
  /** Enable debug mode */
  debug: boolean;
}
      `);
      
      const result = parseFile(filePath);
      
      expect(result.interfaces).toHaveLength(1);
      const iface = result.interfaces[0];
      expect(iface.name).toBe('Config');
      expect(iface.description).toBe('Configuration options');
      expect(iface.properties).toHaveLength(3);
      
      const timeoutProp = iface.properties.find(p => p.name === 'timeout');
      expect(timeoutProp?.optional).toBe(true);
      
      const debugProp = iface.properties.find(p => p.name === 'debug');
      expect(debugProp?.optional).toBe(false);
    });
    
    it('should parse a type alias', () => {
      const filePath = path.join(tempDir, 'type.ts');
      fs.writeFileSync(filePath, `
/**
 * Possible status values
 */
export type Status = 'pending' | 'active' | 'completed';
      `);
      
      const result = parseFile(filePath);
      
      expect(result.types).toHaveLength(1);
      expect(result.types[0].name).toBe('Status');
      expect(result.types[0].description).toBe('Possible status values');
      expect(result.types[0].definition).toContain('pending');
    });
    
    it('should handle files with no exports', () => {
      const filePath = path.join(tempDir, 'no-exports.ts');
      fs.writeFileSync(filePath, `
function internalFunction(): void {
  console.log('internal');
}

const privateConst = 42;
      `);
      
      const result = parseFile(filePath);
      
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].exported).toBe(false);
    });
    
    it('should parse JavaScript files', () => {
      const filePath = path.join(tempDir, 'javascript.js');
      fs.writeFileSync(filePath, `
/**
 * Multiplies two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The product
 */
export function multiply(a, b) {
  return a * b;
}
      `);
      
      const result = parseFile(filePath);
      
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].name).toBe('multiply');
    });
    
    it('should handle complex generic types', () => {
      const filePath = path.join(tempDir, 'generics.ts');
      fs.writeFileSync(filePath, `
/**
 * A result type
 */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

/**
 * Maps values
 */
export function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}
      `);
      
      const result = parseFile(filePath);
      
      expect(result.types).toHaveLength(1);
      expect(result.functions).toHaveLength(1);
    });
    
    it('should return line numbers', () => {
      const filePath = path.join(tempDir, 'lines.ts');
      fs.writeFileSync(filePath, `
export function first(): void {}

export function second(): void {}

export function third(): void {}
      `);
      
      const result = parseFile(filePath);
      
      expect(result.functions).toHaveLength(3);
      expect(result.functions[0].line).toBe(2);
      expect(result.functions[1].line).toBe(4);
      expect(result.functions[2].line).toBe(6);
    });
    
    it('should handle empty files', () => {
      const filePath = path.join(tempDir, 'empty.ts');
      fs.writeFileSync(filePath, '// Empty file\n');
      
      const result = parseFile(filePath);
      
      expect(result.functions).toHaveLength(0);
      expect(result.classes).toHaveLength(0);
      expect(result.interfaces).toHaveLength(0);
      expect(result.types).toHaveLength(0);
    });
  });
  
  describe('findSourceFiles', () => {
    beforeAll(() => {
      // Create test directory structure
      const srcDir = path.join(tempDir, 'project', 'src');
      const nodeModules = path.join(tempDir, 'project', 'node_modules', 'some-pkg');
      const distDir = path.join(tempDir, 'project', 'dist');
      
      fs.mkdirSync(srcDir, { recursive: true });
      fs.mkdirSync(nodeModules, { recursive: true });
      fs.mkdirSync(distDir, { recursive: true });
      
      fs.writeFileSync(path.join(srcDir, 'index.ts'), 'export {};');
      fs.writeFileSync(path.join(srcDir, 'utils.ts'), 'export {};');
      fs.writeFileSync(path.join(srcDir, 'component.tsx'), 'export {};');
      fs.writeFileSync(path.join(nodeModules, 'index.js'), 'export {};');
      fs.writeFileSync(path.join(distDir, 'index.js'), 'export {};');
    });
    
    it('should find TypeScript files in directory', () => {
      const projectDir = path.join(tempDir, 'project');
      const files = findSourceFiles(projectDir);
      
      expect(files.some(f => f.includes('index.ts'))).toBe(true);
      expect(files.some(f => f.includes('utils.ts'))).toBe(true);
      expect(files.some(f => f.includes('component.tsx'))).toBe(true);
    });
    
    it('should exclude node_modules', () => {
      const projectDir = path.join(tempDir, 'project');
      const files = findSourceFiles(projectDir);
      
      expect(files.some(f => f.includes('node_modules'))).toBe(false);
    });
    
    it('should exclude dist directory', () => {
      const projectDir = path.join(tempDir, 'project');
      const files = findSourceFiles(projectDir);
      
      expect(files.some(f => f.includes('/dist/'))).toBe(false);
    });
    
    it('should filter by extension', () => {
      const projectDir = path.join(tempDir, 'project');
      const files = findSourceFiles(projectDir, ['.tsx']);
      
      expect(files.every(f => f.endsWith('.tsx'))).toBe(true);
      expect(files.length).toBe(1);
    });
    
    it('should return empty array for empty directory', () => {
      const emptyDir = path.join(tempDir, 'empty-dir');
      fs.mkdirSync(emptyDir, { recursive: true });
      
      const files = findSourceFiles(emptyDir);
      
      expect(files).toHaveLength(0);
    });
  });
});
