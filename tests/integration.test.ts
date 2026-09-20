/**
 * Integration Tests
 * doc-gen - Skylily 🌸
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { execSync } from 'node:child_process';
import { parseFile, findSourceFiles } from '../src/parser.js';
import { generateDocumentation } from '../src/generator.js';

describe('Integration', () => {
  const tempDir = path.join(os.tmpdir(), 'doc-gen-integration-' + Date.now());
  const projectDir = path.join(tempDir, 'test-project');
  
  beforeAll(() => {
    fs.mkdirSync(path.join(projectDir, 'src'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'src', 'utils'), { recursive: true });
    
    // Create a realistic project structure
    fs.writeFileSync(path.join(projectDir, 'src', 'index.ts'), `
/**
 * @module TestProject
 * Test Project - A sample project for testing doc-gen
 */

export * from './user.js';
export * from './utils/index.js';
    `);
    
    fs.writeFileSync(path.join(projectDir, 'src', 'user.ts'), `
/**
 * User management module
 */

/**
 * User roles in the system
 */
export type UserRole = 'admin' | 'editor' | 'viewer';

/**
 * User account status
 */
export type AccountStatus = 'active' | 'suspended' | 'deleted';

/**
 * Configuration for user creation
 */
export interface CreateUserOptions {
  /** User's email address */
  email: string;
  /** User's display name */
  name: string;
  /** Initial role assignment */
  role?: UserRole;
  /** Whether to send welcome email */
  sendWelcomeEmail?: boolean;
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
  /** Current role */
  role: UserRole;
  /** Account status */
  status: AccountStatus;
  /** Creation timestamp */
  createdAt: Date;
}

/**
 * User management service
 * 
 * Provides methods for creating, updating, and managing users.
 * 
 * @example
 * const service = new UserService();
 * const user = await service.createUser({ email: 'test@example.com', name: 'Test' });
 */
export class UserService {
  /** Base API URL */
  public readonly baseUrl: string;
  
  /** Internal user cache */
  private cache: Map<string, User> = new Map();
  
  /**
   * Creates a new UserService instance
   * @param baseUrl - API base URL
   */
  constructor(baseUrl: string = 'https://api.example.com') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Creates a new user
   * @param options - User creation options
   * @returns The created user
   * @throws {Error} If email is invalid
   */
  async createUser(options: CreateUserOptions): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).slice(2),
      email: options.email,
      name: options.name,
      role: options.role || 'viewer',
      status: 'active',
      createdAt: new Date(),
    };
    this.cache.set(user.id, user);
    return user;
  }
  
  /**
   * Retrieves a user by ID
   * @param id - User ID
   * @returns The user if found, undefined otherwise
   */
  async getUser(id: string): Promise<User | undefined> {
    return this.cache.get(id);
  }
  
  /**
   * Updates a user's role
   * @param id - User ID
   * @param role - New role
   * @returns Updated user
   */
  async updateRole(id: string, role: UserRole): Promise<User | undefined> {
    const user = this.cache.get(id);
    if (user) {
      user.role = role;
    }
    return user;
  }
  
  /**
   * Deletes a user
   * @param id - User ID
   * @returns True if user was deleted
   */
  async deleteUser(id: string): Promise<boolean> {
    return this.cache.delete(id);
  }
  
  /**
   * Internal validation method
   */
  private _validateEmail(email: string): boolean {
    return email.includes('@');
  }
}

/**
 * Creates a guest user with limited permissions
 * @param name - Guest name
 * @returns A guest user object
 */
export function createGuestUser(name: string): User {
  return {
    id: 'guest-' + Date.now(),
    email: 'guest@example.com',
    name,
    role: 'viewer',
    status: 'active',
    createdAt: new Date(),
  };
}
    `);
    
    fs.writeFileSync(path.join(projectDir, 'src', 'utils', 'index.ts'), `
/**
 * Utility functions
 */

export * from './string.js';
export * from './array.js';
    `);
    
    fs.writeFileSync(path.join(projectDir, 'src', 'utils', 'string.ts'), `
/**
 * String utilities
 */

/**
 * Capitalizes the first letter of a string
 * @param str - Input string
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a maximum length
 * @param str - Input string
 * @param maxLength - Maximum length
 * @param suffix - Suffix to append (default: '...')
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Converts a string to kebab-case
 * @param str - Input string
 * @returns Kebab-cased string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\\s+/g, '-')
    .toLowerCase();
}
    `);
    
    fs.writeFileSync(path.join(projectDir, 'src', 'utils', 'array.ts'), `
/**
 * Array utilities
 */

/**
 * Removes duplicate values from an array
 * @param arr - Input array
 * @returns Array with unique values
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Groups array items by a key
 * @param arr - Input array
 * @param keyFn - Function to extract group key
 * @returns Map of grouped items
 */
export function groupBy<T, K>(arr: T[], keyFn: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of arr) {
    const key = keyFn(item);
    const group = map.get(key) || [];
    group.push(item);
    map.set(key, group);
  }
  return map;
}

/**
 * Chunks an array into smaller arrays
 * @param arr - Input array
 * @param size - Chunk size
 * @returns Array of chunks
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
    `);
  });
  
  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  it('should find all source files in project', () => {
    const files = findSourceFiles(path.join(projectDir, 'src'));
    
    expect(files.length).toBe(5);
    expect(files.some(f => f.includes('user.ts'))).toBe(true);
    expect(files.some(f => f.includes('string.ts'))).toBe(true);
    expect(files.some(f => f.includes('array.ts'))).toBe(true);
  });
  
  it('should parse all files without errors', () => {
    const files = findSourceFiles(path.join(projectDir, 'src'));
    
    const parsed = files.map(file => parseFile(file));
    
    expect(parsed.length).toBe(5);
    parsed.forEach(p => {
      expect(p.path).toBeTruthy();
    });
  });
  
  it('should extract classes, interfaces, types, and functions', () => {
    const files = findSourceFiles(path.join(projectDir, 'src'));
    const parsed = files.map(file => parseFile(file));
    
    const allClasses = parsed.flatMap(p => p.classes);
    const allInterfaces = parsed.flatMap(p => p.interfaces);
    const allTypes = parsed.flatMap(p => p.types);
    const allFunctions = parsed.flatMap(p => p.functions);
    
    expect(allClasses.some(c => c.name === 'UserService')).toBe(true);
    expect(allInterfaces.some(i => i.name === 'User')).toBe(true);
    expect(allInterfaces.some(i => i.name === 'CreateUserOptions')).toBe(true);
    expect(allTypes.some(t => t.name === 'UserRole')).toBe(true);
    expect(allFunctions.some(f => f.name === 'capitalize')).toBe(true);
    expect(allFunctions.some(f => f.name === 'unique')).toBe(true);
  });
  
  it('should generate complete documentation', () => {
    const files = findSourceFiles(path.join(projectDir, 'src'));
    const parsed = files.map(file => parseFile(file));
    
    const docs = generateDocumentation(parsed, {
      title: 'Test Project API',
      includeTableOfContents: true,
    });
    
    // Check structure
    expect(docs).toContain('# Test Project API');
    expect(docs).toContain('## Table of Contents');
    expect(docs).toContain('## Classes');
    expect(docs).toContain('## Interfaces');
    expect(docs).toContain('## Types');
    expect(docs).toContain('## Functions');
    
    // Check content
    expect(docs).toContain('UserService');
    expect(docs).toContain('createUser');
    expect(docs).toContain('User');
    expect(docs).toContain('UserRole');
    expect(docs).toContain('capitalize');
    expect(docs).toContain('truncate');
  });
  
  it('should generate documentation grouped by file', () => {
    const files = findSourceFiles(path.join(projectDir, 'src'));
    const parsed = files.map(file => parseFile(file));
    
    const docs = generateDocumentation(parsed, {
      title: 'Test Project API',
      groupByFile: true,
    });
    
    expect(docs).toContain('## user.ts');
    expect(docs).toContain('## string.ts');
    expect(docs).toContain('## array.ts');
  });
  
  it('should properly document class inheritance', () => {
    const userFile = path.join(projectDir, 'src', 'user.ts');
    const parsed = parseFile(userFile);
    
    const userService = parsed.classes.find(c => c.name === 'UserService');
    expect(userService).toBeDefined();
    expect(userService!.properties.length).toBeGreaterThan(0);
    expect(userService!.methods.length).toBeGreaterThan(0);
    
    // Should have public and private members
    expect(userService!.properties.some(p => p.visibility === 'public')).toBe(true);
    expect(userService!.properties.some(p => p.visibility === 'private')).toBe(true);
  });
  
  it('should extract interface properties correctly', () => {
    const userFile = path.join(projectDir, 'src', 'user.ts');
    const parsed = parseFile(userFile);
    
    const createOptions = parsed.interfaces.find(i => i.name === 'CreateUserOptions');
    expect(createOptions).toBeDefined();
    
    const emailProp = createOptions!.properties.find(p => p.name === 'email');
    expect(emailProp).toBeDefined();
    expect(emailProp!.optional).toBe(false);
    
    const roleProp = createOptions!.properties.find(p => p.name === 'role');
    expect(roleProp).toBeDefined();
    expect(roleProp!.optional).toBe(true);
  });
  
  it('should handle generic functions', () => {
    const arrayFile = path.join(projectDir, 'src', 'utils', 'array.ts');
    const parsed = parseFile(arrayFile);
    
    const uniqueFn = parsed.functions.find(f => f.name === 'unique');
    expect(uniqueFn).toBeDefined();
    
    const groupByFn = parsed.functions.find(f => f.name === 'groupBy');
    expect(groupByFn).toBeDefined();
    expect(groupByFn!.params.length).toBe(2);
  });
  
  it('should generate markdown with proper formatting', () => {
    const files = findSourceFiles(path.join(projectDir, 'src'));
    const parsed = files.map(file => parseFile(file));
    const docs = generateDocumentation(parsed);
    
    // Check markdown formatting
    expect(docs).toMatch(/^# /m); // H1 header
    expect(docs).toMatch(/^## /m); // H2 headers
    expect(docs).toMatch(/^### /m); // H3 headers
    expect(docs).toMatch(/```typescript/); // Code blocks
    expect(docs).toMatch(/\|.*\|.*\|/); // Tables
    expect(docs).toMatch(/\*\*.*\*\*/); // Bold text
  });
  
  it('should exclude private members by default', () => {
    const files = findSourceFiles(path.join(projectDir, 'src'));
    const parsed = files.map(file => parseFile(file));
    const docs = generateDocumentation(parsed, { includePrivate: false });
    
    // Private method _validateEmail should not be in docs
    expect(docs).not.toContain('_validateEmail');
  });
  
  it('should include private members when requested', () => {
    const files = findSourceFiles(path.join(projectDir, 'src'));
    const parsed = files.map(file => parseFile(file));
    const docs = generateDocumentation(parsed, { includePrivate: true });
    
    // Private property cache should be in docs
    expect(docs).toContain('cache');
  });
});
