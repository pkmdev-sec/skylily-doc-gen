/**
 * Source Code Parser
 * doc-gen - Skylily 🌸
 * 
 * Parses TypeScript/JavaScript files to extract documentation.
 */

import * as ts from 'typescript';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface DocFunction {
  name: string;
  description: string;
  params: Array<{ name: string; type: string; description: string }>;
  returns: { type: string; description: string };
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
  properties: Array<{ name: string; type: string; description: string; visibility: string }>;
  exported: boolean;
  line: number;
}

export interface DocInterface {
  name: string;
  description: string;
  properties: Array<{ name: string; type: string; optional: boolean; description: string }>;
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
 * Get JSDoc comment for a node
 */
function getJSDoc(node: ts.Node, sourceFile: ts.SourceFile): string {
  const jsDocs = (node as any).jsDoc as ts.JSDoc[] | undefined;
  if (jsDocs && jsDocs.length > 0) {
    return jsDocs.map(doc => doc.comment?.toString() || '').join('\n').trim();
  }
  
  // Try to get leading comments
  const fullText = sourceFile.getFullText();
  const nodeStart = node.getFullStart();
  const leadingComments = ts.getLeadingCommentRanges(fullText, nodeStart);
  
  if (leadingComments && leadingComments.length > 0) {
    const lastComment = leadingComments[leadingComments.length - 1];
    const commentText = fullText.slice(lastComment.pos, lastComment.end);
    
    // Parse JSDoc style comments
    if (commentText.startsWith('/**')) {
      return commentText
        .replace(/^\/\*\*\s*/, '')
        .replace(/\s*\*\/$/, '')
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, ''))
        .filter(line => !line.startsWith('@'))
        .join('\n')
        .trim();
    }
  }
  
  return '';
}

/**
 * Get type string from TypeNode
 */
function getTypeString(typeNode: ts.TypeNode | undefined, checker: ts.TypeChecker): string {
  if (!typeNode) return 'any';
  
  const type = checker.getTypeFromTypeNode(typeNode);
  return checker.typeToString(type);
}

/**
 * Check if node is exported
 */
function isExported(node: ts.Node): boolean {
  return (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0;
}

/**
 * Parse a function declaration
 */
function parseFunction(node: ts.FunctionDeclaration | ts.MethodDeclaration, sourceFile: ts.SourceFile, checker: ts.TypeChecker): DocFunction {
  const name = node.name?.getText(sourceFile) || 'anonymous';
  const description = getJSDoc(node, sourceFile);
  
  const params = node.parameters.map(param => ({
    name: param.name.getText(sourceFile),
    type: getTypeString(param.type, checker),
    description: '', // Would need to parse @param tags
  }));
  
  const returnType = node.type ? getTypeString(node.type, checker) : 'void';
  const isAsync = node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword) || false;
  
  return {
    name,
    description,
    params,
    returns: { type: returnType, description: '' },
    async: isAsync,
    exported: ts.isFunctionDeclaration(node) ? isExported(node) : true,
    line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
  };
}

/**
 * Parse a class declaration
 */
function parseClass(node: ts.ClassDeclaration, sourceFile: ts.SourceFile, checker: ts.TypeChecker): DocClass {
  const name = node.name?.getText(sourceFile) || 'AnonymousClass';
  const description = getJSDoc(node, sourceFile);
  
  const methods: DocFunction[] = [];
  const properties: DocClass['properties'] = [];
  
  let extendsClause: string | undefined;
  const implementsClauses: string[] = [];
  
  // Get heritage clauses
  node.heritageClauses?.forEach(clause => {
    if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
      extendsClause = clause.types[0]?.getText(sourceFile);
    } else if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
      clause.types.forEach(t => implementsClauses.push(t.getText(sourceFile)));
    }
  });
  
  // Parse members
  node.members.forEach(member => {
    if (ts.isMethodDeclaration(member)) {
      methods.push(parseFunction(member, sourceFile, checker));
    } else if (ts.isPropertyDeclaration(member)) {
      const visibility = member.modifiers?.some(m => m.kind === ts.SyntaxKind.PrivateKeyword) ? 'private'
        : member.modifiers?.some(m => m.kind === ts.SyntaxKind.ProtectedKeyword) ? 'protected'
        : 'public';
      
      properties.push({
        name: member.name.getText(sourceFile),
        type: getTypeString(member.type, checker),
        description: getJSDoc(member, sourceFile),
        visibility,
      });
    }
  });
  
  return {
    name,
    description,
    extends: extendsClause,
    implements: implementsClauses,
    methods,
    properties,
    exported: isExported(node),
    line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
  };
}

/**
 * Parse an interface declaration
 */
function parseInterface(node: ts.InterfaceDeclaration, sourceFile: ts.SourceFile, checker: ts.TypeChecker): DocInterface {
  const name = node.name.getText(sourceFile);
  const description = getJSDoc(node, sourceFile);
  
  const properties = node.members
    .filter(ts.isPropertySignature)
    .map(member => ({
      name: member.name.getText(sourceFile),
      type: getTypeString(member.type, checker),
      optional: member.questionToken !== undefined,
      description: getJSDoc(member, sourceFile),
    }));
  
  return {
    name,
    description,
    properties,
    exported: isExported(node),
    line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
  };
}

/**
 * Parse a type alias declaration
 */
function parseTypeAlias(node: ts.TypeAliasDeclaration, sourceFile: ts.SourceFile, checker: ts.TypeChecker): DocType {
  const name = node.name.getText(sourceFile);
  const description = getJSDoc(node, sourceFile);
  const definition = node.type.getText(sourceFile);
  
  return {
    name,
    description,
    definition,
    exported: isExported(node),
    line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
  };
}

/**
 * Parse a TypeScript/JavaScript file
 */
export function parseFile(filePath: string): ParsedFile {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : 
    filePath.endsWith('.ts') ? ts.ScriptKind.TS :
    filePath.endsWith('.jsx') ? ts.ScriptKind.JSX : ts.ScriptKind.JS
  );
  
  // Create a minimal program for type checking
  const compilerHost = ts.createCompilerHost({});
  compilerHost.getSourceFile = (fileName) => {
    if (fileName === filePath) return sourceFile;
    return undefined;
  };
  
  const program = ts.createProgram([filePath], {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    allowJs: true,
  }, compilerHost);
  
  const checker = program.getTypeChecker();
  
  const result: ParsedFile = {
    path: filePath,
    functions: [],
    classes: [],
    interfaces: [],
    types: [],
    exports: [],
  };
  
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      result.functions.push(parseFunction(node, sourceFile, checker));
    } else if (ts.isClassDeclaration(node)) {
      result.classes.push(parseClass(node, sourceFile, checker));
    } else if (ts.isInterfaceDeclaration(node)) {
      result.interfaces.push(parseInterface(node, sourceFile, checker));
    } else if (ts.isTypeAliasDeclaration(node)) {
      result.types.push(parseTypeAlias(node, sourceFile, checker));
    }
    
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  
  return result;
}

/**
 * Find all source files in a directory
 */
export function findSourceFiles(dir: string, extensions = ['.ts', '.tsx', '.js', '.jsx']): string[] {
  const files: string[] = [];
  
  function scan(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip common non-source directories
        if (!['node_modules', '.git', 'dist', 'build', 'coverage', '.next'].includes(entry.name)) {
          scan(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scan(dir);
  return files;
}
