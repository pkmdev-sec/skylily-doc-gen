/**
 * Custom Template Example
 * doc-gen - Skylily 🌸
 * 
 * This example shows how to create custom documentation output
 * by working directly with parsed data.
 */

import { parseFile, findSourceFiles, ParsedFile } from 'skylily-doc-gen';
import * as fs from 'node:fs';

/**
 * Custom documentation generator that creates JSON output
 */
function generateJSONDocs(files: ParsedFile[]): string {
  const documentation = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      totalClasses: files.reduce((sum, f) => sum + f.classes.filter(c => c.exported).length, 0),
      totalInterfaces: files.reduce((sum, f) => sum + f.interfaces.filter(i => i.exported).length, 0),
      totalFunctions: files.reduce((sum, f) => sum + f.functions.filter(fn => fn.exported).length, 0),
      totalTypes: files.reduce((sum, f) => sum + f.types.filter(t => t.exported).length, 0),
    },
    classes: files.flatMap(f => f.classes.filter(c => c.exported).map(cls => ({
      name: cls.name,
      description: cls.description,
      file: f.path,
      line: cls.line,
      extends: cls.extends,
      implements: cls.implements,
      methodCount: cls.methods.length,
      propertyCount: cls.properties.length,
    }))),
    interfaces: files.flatMap(f => f.interfaces.filter(i => i.exported).map(iface => ({
      name: iface.name,
      description: iface.description,
      file: f.path,
      line: iface.line,
      propertyCount: iface.properties.length,
    }))),
    functions: files.flatMap(f => f.functions.filter(fn => fn.exported).map(func => ({
      name: func.name,
      description: func.description,
      file: f.path,
      line: func.line,
      async: func.async,
      params: func.params.map(p => p.name),
      returnType: func.returns.type,
    }))),
    types: files.flatMap(f => f.types.filter(t => t.exported).map(type => ({
      name: type.name,
      description: type.description,
      file: f.path,
      line: type.line,
      definition: type.definition,
    }))),
  };
  
  return JSON.stringify(documentation, null, 2);
}

/**
 * Custom documentation generator that creates HTML output
 */
function generateHTMLDocs(files: ParsedFile[], title: string): string {
  const classes = files.flatMap(f => f.classes.filter(c => c.exported));
  const interfaces = files.flatMap(f => f.interfaces.filter(i => i.exported));
  const functions = files.flatMap(f => f.functions.filter(fn => fn.exported));
  const types = files.flatMap(f => f.types.filter(t => t.exported));
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 2rem; }
    h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
    h2 { color: #555; margin-top: 2rem; }
    h3 { color: #666; }
    code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 3px; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 5px; overflow-x: auto; }
    .item { margin: 1.5rem 0; padding: 1rem; border: 1px solid #eee; border-radius: 5px; }
    .item h3 { margin-top: 0; }
    .badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.8rem; }
    .badge-async { background: #e3f2fd; color: #1976d2; }
    .badge-class { background: #fff3e0; color: #f57c00; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #eee; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>Generated on ${new Date().toLocaleDateString()}</p>
  
  <nav>
    <h2>Table of Contents</h2>
    <ul>
      ${classes.length > 0 ? '<li><a href="#classes">Classes</a></li>' : ''}
      ${interfaces.length > 0 ? '<li><a href="#interfaces">Interfaces</a></li>' : ''}
      ${types.length > 0 ? '<li><a href="#types">Types</a></li>' : ''}
      ${functions.length > 0 ? '<li><a href="#functions">Functions</a></li>' : ''}
    </ul>
  </nav>
  
  ${classes.length > 0 ? `
  <section id="classes">
    <h2>Classes</h2>
    ${classes.map(cls => `
    <div class="item">
      <h3><code>${cls.name}</code> <span class="badge badge-class">class</span></h3>
      ${cls.description ? `<p>${cls.description}</p>` : ''}
      ${cls.extends ? `<p><strong>Extends:</strong> <code>${cls.extends}</code></p>` : ''}
      ${cls.implements.length > 0 ? `<p><strong>Implements:</strong> ${cls.implements.map(i => `<code>${i}</code>`).join(', ')}</p>` : ''}
      ${cls.methods.length > 0 ? `
      <h4>Methods</h4>
      <ul>
        ${cls.methods.map(m => `<li><code>${m.name}(${m.params.map(p => p.name).join(', ')})</code></li>`).join('')}
      </ul>
      ` : ''}
    </div>
    `).join('')}
  </section>
  ` : ''}
  
  ${interfaces.length > 0 ? `
  <section id="interfaces">
    <h2>Interfaces</h2>
    ${interfaces.map(iface => `
    <div class="item">
      <h3><code>${iface.name}</code></h3>
      ${iface.description ? `<p>${iface.description}</p>` : ''}
      ${iface.properties.length > 0 ? `
      <table>
        <thead><tr><th>Property</th><th>Type</th><th>Optional</th></tr></thead>
        <tbody>
          ${iface.properties.map(p => `<tr><td><code>${p.name}</code></td><td><code>${p.type}</code></td><td>${p.optional ? '✓' : ''}</td></tr>`).join('')}
        </tbody>
      </table>
      ` : ''}
    </div>
    `).join('')}
  </section>
  ` : ''}
  
  ${functions.length > 0 ? `
  <section id="functions">
    <h2>Functions</h2>
    ${functions.map(fn => `
    <div class="item">
      <h3><code>${fn.name}</code> ${fn.async ? '<span class="badge badge-async">async</span>' : ''}</h3>
      ${fn.description ? `<p>${fn.description}</p>` : ''}
      <pre><code>${fn.async ? 'async ' : ''}${fn.name}(${fn.params.map(p => `${p.name}: ${p.type}`).join(', ')}): ${fn.returns.type}</code></pre>
    </div>
    `).join('')}
  </section>
  ` : ''}
</body>
</html>`;
}

// Usage
const sourceDir = './src';
const files = findSourceFiles(sourceDir).map(f => parseFile(f));

// Generate JSON documentation
const jsonDocs = generateJSONDocs(files);
fs.writeFileSync('./docs/api.json', jsonDocs);
console.log('Generated: ./docs/api.json');

// Generate HTML documentation
const htmlDocs = generateHTMLDocs(files, 'My Project API');
fs.writeFileSync('./docs/api.html', htmlDocs);
console.log('Generated: ./docs/api.html');
