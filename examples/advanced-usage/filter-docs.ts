/**
 * Filtering Documentation Example
 * doc-gen - Skylily 🌸
 * 
 * This example shows how to filter and customize documentation output.
 */

import { parseFile, findSourceFiles, generateDocumentation, ParsedFile } from 'skylily-doc-gen';

const sourceDir = './src';
const allFiles = findSourceFiles(sourceDir).map(f => parseFile(f));

/**
 * Filter to only include files from a specific directory
 */
function filterByDirectory(files: ParsedFile[], dirName: string): ParsedFile[] {
  return files.filter(f => f.path.includes(`/${dirName}/`));
}

/**
 * Filter to only include items with descriptions
 */
function filterDocumented(files: ParsedFile[]): ParsedFile[] {
  return files.map(f => ({
    ...f,
    functions: f.functions.filter(fn => fn.description.length > 0),
    classes: f.classes.filter(c => c.description.length > 0),
    interfaces: f.interfaces.filter(i => i.description.length > 0),
    types: f.types.filter(t => t.description.length > 0),
  }));
}

/**
 * Filter to only include async functions
 */
function filterAsyncFunctions(files: ParsedFile[]): ParsedFile[] {
  return files.map(f => ({
    ...f,
    functions: f.functions.filter(fn => fn.async),
    classes: f.classes.map(c => ({
      ...c,
      methods: c.methods.filter(m => m.async),
    })),
  }));
}

/**
 * Filter to exclude test files
 */
function excludeTestFiles(files: ParsedFile[]): ParsedFile[] {
  return files.filter(f => 
    !f.path.includes('.test.') && 
    !f.path.includes('.spec.') &&
    !f.path.includes('__tests__')
  );
}

// Example: Generate docs for only the 'utils' directory
const utilsDocs = generateDocumentation(
  filterByDirectory(allFiles, 'utils'),
  { title: 'Utilities API' }
);

// Example: Generate docs for only documented items
const documentedDocs = generateDocumentation(
  filterDocumented(allFiles),
  { title: 'Documented API' }
);

// Example: Generate docs for only async functions
const asyncDocs = generateDocumentation(
  filterAsyncFunctions(allFiles),
  { title: 'Async API' }
);

// Example: Exclude test files
const productionDocs = generateDocumentation(
  excludeTestFiles(allFiles),
  { title: 'Production API' }
);

console.log('Generated filtered documentation variants');
