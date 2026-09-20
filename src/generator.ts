/**
 * Documentation Generator
 * doc-gen - Skylily 🌸
 * 
 * Generates markdown documentation from parsed files.
 */

import * as path from 'node:path';
import { ParsedFile, DocFunction, DocClass, DocInterface, DocType } from './parser.js';

export interface GeneratorOptions {
  title?: string;
  includePrivate?: boolean;
  groupByFile?: boolean;
  includeTableOfContents?: boolean;
}

/**
 * Generate function signature
 */
function functionSignature(fn: DocFunction): string {
  const params = fn.params.map(p => `${p.name}: ${p.type}`).join(', ');
  const asyncPrefix = fn.async ? 'async ' : '';
  return `${asyncPrefix}${fn.name}(${params}): ${fn.returns.type}`;
}

/**
 * Generate markdown for a function
 */
function generateFunctionDoc(fn: DocFunction): string {
  const lines: string[] = [];
  
  lines.push(`#### \`${fn.name}\``);
  lines.push('');
  
  if (fn.description) {
    lines.push(fn.description);
    lines.push('');
  }
  
  lines.push('```typescript');
  lines.push(functionSignature(fn));
  lines.push('```');
  lines.push('');
  
  if (fn.params.length > 0) {
    lines.push('**Parameters:**');
    lines.push('');
    lines.push('| Name | Type | Description |');
    lines.push('|------|------|-------------|');
    for (const param of fn.params) {
      lines.push(`| \`${param.name}\` | \`${param.type}\` | ${param.description || '-'} |`);
    }
    lines.push('');
  }
  
  if (fn.returns.type !== 'void') {
    lines.push(`**Returns:** \`${fn.returns.type}\`${fn.returns.description ? ` - ${fn.returns.description}` : ''}`);
    lines.push('');
  }
  
  return lines.join('\n');
}

/**
 * Generate markdown for a class
 */
function generateClassDoc(cls: DocClass, options: GeneratorOptions): string {
  const lines: string[] = [];
  
  lines.push(`### \`${cls.name}\``);
  lines.push('');
  
  if (cls.description) {
    lines.push(cls.description);
    lines.push('');
  }
  
  if (cls.extends) {
    lines.push(`**Extends:** \`${cls.extends}\``);
    lines.push('');
  }
  
  if (cls.implements.length > 0) {
    lines.push(`**Implements:** ${cls.implements.map(i => `\`${i}\``).join(', ')}`);
    lines.push('');
  }
  
  // Properties
  const properties = options.includePrivate 
    ? cls.properties 
    : cls.properties.filter(p => p.visibility === 'public');
  
  if (properties.length > 0) {
    lines.push('#### Properties');
    lines.push('');
    lines.push('| Name | Type | Visibility | Description |');
    lines.push('|------|------|------------|-------------|');
    for (const prop of properties) {
      lines.push(`| \`${prop.name}\` | \`${prop.type}\` | ${prop.visibility} | ${prop.description || '-'} |`);
    }
    lines.push('');
  }
  
  // Methods
  const methods = options.includePrivate
    ? cls.methods
    : cls.methods.filter(m => !m.name.startsWith('_') && !m.name.startsWith('#'));
  
  if (methods.length > 0) {
    lines.push('#### Methods');
    lines.push('');
    for (const method of methods) {
      lines.push(generateFunctionDoc(method));
    }
  }
  
  return lines.join('\n');
}

/**
 * Generate markdown for an interface
 */
function generateInterfaceDoc(iface: DocInterface): string {
  const lines: string[] = [];
  
  lines.push(`### \`${iface.name}\``);
  lines.push('');
  
  if (iface.description) {
    lines.push(iface.description);
    lines.push('');
  }
  
  if (iface.properties.length > 0) {
    lines.push('| Property | Type | Optional | Description |');
    lines.push('|----------|------|----------|-------------|');
    for (const prop of iface.properties) {
      const optional = prop.optional ? '✓' : '';
      lines.push(`| \`${prop.name}\` | \`${prop.type}\` | ${optional} | ${prop.description || '-'} |`);
    }
    lines.push('');
  }
  
  return lines.join('\n');
}

/**
 * Generate markdown for a type alias
 */
function generateTypeDoc(type: DocType): string {
  const lines: string[] = [];
  
  lines.push(`### \`${type.name}\``);
  lines.push('');
  
  if (type.description) {
    lines.push(type.description);
    lines.push('');
  }
  
  lines.push('```typescript');
  lines.push(`type ${type.name} = ${type.definition}`);
  lines.push('```');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Generate table of contents
 */
function generateTableOfContents(files: ParsedFile[]): string {
  const lines: string[] = [];
  
  lines.push('## Table of Contents');
  lines.push('');
  
  // Collect all items
  const classes: string[] = [];
  const interfaces: string[] = [];
  const functions: string[] = [];
  const types: string[] = [];
  
  for (const file of files) {
    for (const cls of file.classes.filter(c => c.exported)) {
      classes.push(cls.name);
    }
    for (const iface of file.interfaces.filter(i => i.exported)) {
      interfaces.push(iface.name);
    }
    for (const fn of file.functions.filter(f => f.exported)) {
      functions.push(fn.name);
    }
    for (const type of file.types.filter(t => t.exported)) {
      types.push(type.name);
    }
  }
  
  if (classes.length > 0) {
    lines.push('### Classes');
    for (const name of classes.sort()) {
      lines.push(`- [\`${name}\`](#${name.toLowerCase()})`);
    }
    lines.push('');
  }
  
  if (interfaces.length > 0) {
    lines.push('### Interfaces');
    for (const name of interfaces.sort()) {
      lines.push(`- [\`${name}\`](#${name.toLowerCase()})`);
    }
    lines.push('');
  }
  
  if (types.length > 0) {
    lines.push('### Types');
    for (const name of types.sort()) {
      lines.push(`- [\`${name}\`](#${name.toLowerCase()})`);
    }
    lines.push('');
  }
  
  if (functions.length > 0) {
    lines.push('### Functions');
    for (const name of functions.sort()) {
      lines.push(`- [\`${name}\`](#${name.toLowerCase()})`);
    }
    lines.push('');
  }
  
  return lines.join('\n');
}

/**
 * Generate full documentation from parsed files
 */
export function generateDocumentation(files: ParsedFile[], options: GeneratorOptions = {}): string {
  const {
    title = 'API Documentation',
    includePrivate = false,
    groupByFile = false,
    includeTableOfContents = true,
  } = options;
  
  const lines: string[] = [];
  
  // Header
  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`*Generated by doc-gen on ${new Date().toISOString().split('T')[0]}*`);
  lines.push('');
  
  // Table of contents
  if (includeTableOfContents) {
    lines.push(generateTableOfContents(files));
  }
  
  if (groupByFile) {
    // Group by file
    for (const file of files) {
      const relativePath = file.path;
      const hasContent = file.classes.length > 0 || file.interfaces.length > 0 || 
                        file.functions.length > 0 || file.types.length > 0;
      
      if (!hasContent) continue;
      
      lines.push(`## ${path.basename(relativePath)}`);
      lines.push('');
      lines.push(`*File: \`${relativePath}\`*`);
      lines.push('');
      
      // Classes
      for (const cls of file.classes.filter(c => c.exported || includePrivate)) {
        lines.push(generateClassDoc(cls, options));
      }
      
      // Interfaces
      for (const iface of file.interfaces.filter(i => i.exported || includePrivate)) {
        lines.push(generateInterfaceDoc(iface));
      }
      
      // Types
      for (const type of file.types.filter(t => t.exported || includePrivate)) {
        lines.push(generateTypeDoc(type));
      }
      
      // Functions
      if (file.functions.filter(f => f.exported || includePrivate).length > 0) {
        lines.push('### Functions');
        lines.push('');
        for (const fn of file.functions.filter(f => f.exported || includePrivate)) {
          lines.push(generateFunctionDoc(fn));
        }
      }
    }
  } else {
    // Group by type
    const allClasses = files.flatMap(f => f.classes.filter(c => c.exported || includePrivate));
    const allInterfaces = files.flatMap(f => f.interfaces.filter(i => i.exported || includePrivate));
    const allTypes = files.flatMap(f => f.types.filter(t => t.exported || includePrivate));
    const allFunctions = files.flatMap(f => f.functions.filter(fn => fn.exported || includePrivate));
    
    if (allClasses.length > 0) {
      lines.push('## Classes');
      lines.push('');
      for (const cls of allClasses.sort((a, b) => a.name.localeCompare(b.name))) {
        lines.push(generateClassDoc(cls, options));
      }
    }
    
    if (allInterfaces.length > 0) {
      lines.push('## Interfaces');
      lines.push('');
      for (const iface of allInterfaces.sort((a, b) => a.name.localeCompare(b.name))) {
        lines.push(generateInterfaceDoc(iface));
      }
    }
    
    if (allTypes.length > 0) {
      lines.push('## Types');
      lines.push('');
      for (const type of allTypes.sort((a, b) => a.name.localeCompare(b.name))) {
        lines.push(generateTypeDoc(type));
      }
    }
    
    if (allFunctions.length > 0) {
      lines.push('## Functions');
      lines.push('');
      for (const fn of allFunctions.sort((a, b) => a.name.localeCompare(b.name))) {
        lines.push(generateFunctionDoc(fn));
      }
    }
  }
  
  return lines.join('\n');
}
