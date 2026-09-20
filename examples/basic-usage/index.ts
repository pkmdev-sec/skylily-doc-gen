/**
 * Basic Usage Example
 * doc-gen - Skylily 🌸
 * 
 * This example demonstrates the simplest way to use doc-gen programmatically.
 */

import { parseFile, findSourceFiles, generateDocumentation } from 'skylily-doc-gen';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Example 1: Parse a single file
const singleFilePath = './src/myModule.ts';
const parsedFile = parseFile(singleFilePath);

console.log('Parsed file:', parsedFile.path);
console.log('Functions found:', parsedFile.functions.length);
console.log('Classes found:', parsedFile.classes.length);
console.log('Interfaces found:', parsedFile.interfaces.length);

// Example 2: Find and parse all files in a directory
const sourceDir = './src';
const sourceFiles = findSourceFiles(sourceDir);

console.log(`\nFound ${sourceFiles.length} source files:`);
sourceFiles.forEach(file => console.log(`  - ${file}`));

// Parse all files
const parsedFiles = sourceFiles.map(file => parseFile(file));

// Example 3: Generate documentation
const documentation = generateDocumentation(parsedFiles, {
  title: 'My Project API',
  includeTableOfContents: true,
  includePrivate: false,
  groupByFile: false,
});

// Write to file
const outputPath = './docs/API.md';
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, documentation);

console.log(`\nDocumentation generated: ${outputPath}`);
