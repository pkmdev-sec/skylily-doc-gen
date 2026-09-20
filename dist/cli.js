#!/usr/bin/env node
/**
 * doc-gen CLI
 * Skylily 🌸
 *
 * Usage:
 *   doc-gen ./src                    # Generate docs from src/
 *   doc-gen ./src --output docs/     # Output to docs/
 *   doc-gen ./src --single api.md    # Single file output
 */
import * as fs from 'node:fs';
// Version check
if (process.argv.includes("--version") || process.argv.includes("-V")) {
    const pkgPath = new URL("../package.json", import.meta.url);
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    console.log(`doc-gen v${pkg.version}`);
    process.exit(0);
}
import * as path from 'node:path';
import { findSourceFiles, parseFile } from './parser.js';
import { generateDocumentation } from './generator.js';
// ANSI colors
const c = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};
function printUsage() {
    console.log(`
${c.bright}${c.magenta}📚 doc-gen${c.reset}
${c.dim}Generate documentation from your codebase${c.reset}

${c.cyan}Usage:${c.reset}
  doc-gen <path>                     Generate docs from path
  doc-gen <path> --output <dir>      Output to directory
  doc-gen <path> --single <file>     Single file output

${c.cyan}Options:${c.reset}
  --output, -o <dir>    Output directory (default: docs/)
  --single, -s <file>   Single file output
  --title <title>       Documentation title
  --private             Include private members
  --by-file             Group by file instead of type
  --no-toc              Disable table of contents
  --help, -h            Show this help

${c.cyan}Examples:${c.reset}
  doc-gen ./src
  doc-gen ./src --output docs/
  doc-gen ./src --single API.md --title "My API"
  doc-gen ./src --private --by-file
`);
}
function parseArgs(args) {
    const result = {
        inputPath: undefined,
        outputDir: undefined,
        singleFile: undefined,
        title: undefined,
        includePrivate: false,
        byFile: false,
        includeToc: true,
        help: false,
    };
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--help' || arg === '-h') {
            result.help = true;
        }
        else if (arg === '--output' || arg === '-o') {
            result.outputDir = args[++i];
        }
        else if (arg === '--single' || arg === '-s') {
            result.singleFile = args[++i];
        }
        else if (arg === '--title') {
            result.title = args[++i];
        }
        else if (arg === '--private') {
            result.includePrivate = true;
        }
        else if (arg === '--by-file') {
            result.byFile = true;
        }
        else if (arg === '--no-toc') {
            result.includeToc = false;
        }
        else if (!arg.startsWith('-')) {
            result.inputPath = arg;
        }
    }
    return result;
}
function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help || !args.inputPath) {
        printUsage();
        process.exit(args.help ? 0 : 1);
    }
    const inputPath = path.resolve(args.inputPath);
    if (!fs.existsSync(inputPath)) {
        console.error(`${c.red}Error: Path not found: ${inputPath}${c.reset}`);
        process.exit(1);
    }
    console.log(`${c.bright}${c.magenta}📚 doc-gen${c.reset}\n`);
    // Find source files
    const stats = fs.statSync(inputPath);
    const files = stats.isDirectory()
        ? findSourceFiles(inputPath)
        : [inputPath];
    console.log(`${c.cyan}Found ${files.length} source file(s)${c.reset}`);
    // Parse files
    console.log(`${c.dim}Parsing...${c.reset}`);
    const parsed = files.map(file => {
        try {
            return parseFile(file);
        }
        catch (err) {
            console.warn(`${c.yellow}Warning: Could not parse ${file}${c.reset}`);
            return null;
        }
    }).filter((f) => f !== null);
    // Count items
    const counts = {
        classes: parsed.reduce((sum, f) => sum + f.classes.filter(c => c.exported).length, 0),
        interfaces: parsed.reduce((sum, f) => sum + f.interfaces.filter(i => i.exported).length, 0),
        functions: parsed.reduce((sum, f) => sum + f.functions.filter(fn => fn.exported).length, 0),
        types: parsed.reduce((sum, f) => sum + f.types.filter(t => t.exported).length, 0),
    };
    console.log(`${c.dim}Found: ${counts.classes} classes, ${counts.interfaces} interfaces, ${counts.functions} functions, ${counts.types} types${c.reset}`);
    // Generate documentation
    const options = {
        title: args.title || `API Documentation`,
        includePrivate: args.includePrivate,
        groupByFile: args.byFile,
        includeTableOfContents: args.includeToc,
    };
    const documentation = generateDocumentation(parsed, options);
    // Output
    if (args.singleFile) {
        const outputPath = path.resolve(args.singleFile);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, documentation);
        console.log(`\n${c.green}✓${c.reset} Generated: ${c.bright}${outputPath}${c.reset}`);
    }
    else {
        const outputDir = args.outputDir ? path.resolve(args.outputDir) : path.join(process.cwd(), 'docs');
        fs.mkdirSync(outputDir, { recursive: true });
        const outputPath = path.join(outputDir, 'API.md');
        fs.writeFileSync(outputPath, documentation);
        console.log(`\n${c.green}✓${c.reset} Generated: ${c.bright}${outputPath}${c.reset}`);
    }
    console.log('');
}
main();
//# sourceMappingURL=cli.js.map