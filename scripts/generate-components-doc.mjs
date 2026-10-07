// Generate COMPONENTS.md, the component catalog shipped with the package.
// Usage: node scripts/generate-components-doc.mjs [--check]
//   --check  exit with code 1 when COMPONENTS.md is missing or out of date (for CI)
import { createRequire } from 'node:module';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { categories, entries as entryMeta } from './components-meta.mjs';

const require = createRequire(import.meta.url);
const { parse: parseSfc } = require('@vue/compiler-sfc');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = join(root, 'COMPONENTS.md');
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const packageName = packageJson.name;

/*********************** Source helpers ***********************/

const sourceCache = new Map();

// Read a TS source (or the scripts of an SFC) as a TypeScript source file
const loadSource = (filePath) => {
    if (sourceCache.has(filePath)) return sourceCache.get(filePath);
    const raw = readFileSync(filePath, 'utf8');
    let code = raw;
    let template = '';

    // Merge both script blocks of an SFC so local interfaces and imports are visible
    if (filePath.endsWith('.vue')) {
        const { descriptor } = parseSfc(raw, { filename: filePath });
        code = [descriptor.script?.content, descriptor.scriptSetup?.content].filter(Boolean).join('\n');
        template = descriptor.template?.content ?? '';
    }

    const source = { filePath, template, sourceFile: ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS) };
    sourceCache.set(filePath, source);
    return source;
};

// Resolve a relative module specifier to a file on disk
const resolveModule = (fromFile, specifier) => {
    if (!specifier.startsWith('.')) return null;
    const base = resolve(dirname(fromFile), specifier);
    for (const candidate of [base, `${base}.ts`, join(base, 'index.ts')]) {
        if (existsSync(candidate) && statSync(candidate).isFile() && /\.(ts|vue)$/.test(candidate)) return candidate;
    }
    return null;
};

// Collapse whitespace so types fit on one table line
const oneLine = text => text.replace(/\s+/g, ' ').replace(/\s*;\s*}/g, ' }').trim();

// Escape table cell content
const cell = text => oneLine(text).replace(/\|/g, '\\|');

// Find a named declaration (interface, type alias, variable, or function) in a source file
const findDeclaration = (source, name) => {
    let found = null;
    const visit = (node) => {
        if (found) return;
        if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isFunctionDeclaration(node)) && node.name?.text === name) found = node;
        else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name) found = node;
        else ts.forEachChild(node, visit);
    };
    visit(source.sourceFile);
    return found;
};

// Find where an imported identifier comes from
const findImport = (source, name) => {
    for (const statement of source.sourceFile.statements) {
        if (!ts.isImportDeclaration(statement) || !statement.importClause) continue;
        const bindings = statement.importClause.namedBindings;
        if (bindings && ts.isNamedImports(bindings)) {
            for (const element of bindings.elements) {
                if (element.name.text === name) {
                    return { module: statement.moduleSpecifier.text, importedName: element.propertyName?.text ?? name };
                }
            }
        }
    }
    return null;
};

/*********************** Type expansion ***********************/

// Collect members and inherited external types from a type node
const collectMembers = (source, typeNode, result = { members: [], extendsTypes: [] }, depth = 0) => {
    if (!typeNode || depth > 5) return result;

    if (ts.isTypeLiteralNode(typeNode)) {
        result.members.push(...typeNode.members.map(member => ({ member, source })));
    } else if (ts.isIntersectionTypeNode(typeNode)) {
        typeNode.types.forEach(part => collectMembers(source, part, result, depth + 1));
    } else if (ts.isTypeReferenceNode(typeNode)) {
        collectReference(source, typeNode.typeName.getText(source.sourceFile), result, depth);
    } else if (ts.isParenthesizedTypeNode(typeNode)) {
        collectMembers(source, typeNode.type, result, depth + 1);
    }
    return result;
};

// Expand a named type: local declarations are inlined, external ones are listed as inherited
const collectReference = (source, name, result, depth) => {
    const local = findDeclaration(source, name);
    if (local && ts.isInterfaceDeclaration(local)) {
        for (const clause of local.heritageClauses ?? []) {
            clause.types.forEach(type => collectReference(source, type.expression.getText(source.sourceFile), result, depth + 1));
        }
        result.members.push(...local.members.map(member => ({ member, source })));
        return;
    }
    if (local && ts.isTypeAliasDeclaration(local)) {
        collectMembers(source, local.type, result, depth + 1);
        return;
    }

    // Follow relative imports, record package imports as inherited types
    const imported = findImport(source, name);
    const importedPath = imported ? resolveModule(source.filePath, imported.module) : null;
    if (importedPath) {
        collectReference(loadSource(importedPath), imported.importedName, result, depth + 1);
    } else {
        result.extendsTypes.push(imported ? `${imported.module === 'reka-ui' ? 'Reka ' : ''}\`${imported.importedName}\`` : `\`${name}\``);
    }
};

// Find a macro call such as defineProps<T>() anywhere in the script
const findMacro = (source, macroName) => {
    let found = null;
    const visit = (node) => {
        if (found) return;
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === macroName) found = node;
        else ts.forEachChild(node, visit);
    };
    visit(source.sourceFile);
    return found;
};

// Read prop defaults from withDefaults(defineProps<T>(), { ... })
const readDefaults = (source) => {
    const defaults = new Map();
    const call = findMacro(source, 'withDefaults');
    const objectLiteral = call?.arguments[1];
    if (objectLiteral && ts.isObjectLiteralExpression(objectLiteral)) {
        for (const property of objectLiteral.properties) {
            if (!ts.isPropertyAssignment(property)) continue;
            let value = property.initializer;

            // Unwrap factory defaults such as () => [] or () => PackageIcon
            if (ts.isArrowFunction(value) && !ts.isBlock(value.body)) value = value.body;
            defaults.set(property.name.getText(source.sourceFile), oneLine(value.getText(source.sourceFile)).replace(/ as never$/, ''));
        }
    }
    return defaults;
};

// Describe the props of a component
const readProps = (source) => {
    const call = findMacro(source, 'defineProps');
    const typeArgument = call?.typeArguments?.[0];
    if (!typeArgument) return { props: [], extendsTypes: [] };
    const { members, extendsTypes } = collectMembers(source, typeArgument);
    const defaults = readDefaults(source);
    const seen = new Set();
    const props = [];
    for (const { member, source: memberSource } of members) {
        if (!ts.isPropertySignature(member)) continue;
        const name = member.name.getText(memberSource.sourceFile).replace(/['"]/g, '');
        if (seen.has(name)) continue;
        seen.add(name);
        props.push({
            name,
            type: member.type ? member.type.getText(memberSource.sourceFile) : 'unknown',
            required: !member.questionToken,
            default: defaults.get(name) ?? ''
        });
    }
    return { props, extendsTypes };
};

// Describe the emits of a component
const readEmits = (source) => {
    const call = findMacro(source, 'defineEmits');
    const typeArgument = call?.typeArguments?.[0];
    if (!typeArgument) return { emits: [], extendsTypes: [] };
    const { members, extendsTypes } = collectMembers(source, typeArgument);
    const emits = [];
    for (const { member, source: memberSource } of members) {
        const text = node => node.getText(memberSource.sourceFile);

        // Named tuple syntax: 'update:open': [value: boolean]
        if (ts.isPropertySignature(member) && member.type) {
            const payload = ts.isTupleTypeNode(member.type) ? member.type.elements.map(text).join(', ') : text(member.type);
            emits.push({ name: text(member.name).replace(/['"]/g, ''), payload });
        }

        // Call signature syntax: (e: 'update:modelValue', value: string): void
        if (ts.isCallSignatureDeclaration(member) && member.parameters[0]?.type) {
            emits.push({ name: text(member.parameters[0].type).replace(/['"]/g, ''), payload: member.parameters.slice(1).map(text).join(', ') });
        }
    }
    return { emits, extendsTypes };
};

// Describe the slots of a component (typed slots first, then template slots)
const readSlots = (source) => {
    const slots = new Set();
    const typed = findMacro(source, 'defineSlots')?.typeArguments?.[0];
    if (typed && ts.isTypeLiteralNode(typed)) {
        for (const member of typed.members) {
            const name = member.name ? member.name.getText(source.sourceFile) : member.parameters?.[0]?.type?.getText(source.sourceFile);
            if (name) slots.add(name.replace(/['"]/g, '').replace(/^`(.*)`$/, '$1'));
        }
    }
    for (const match of source.template.matchAll(/<slot\b([^>]*)>/g)) {
        const staticName = match[1].match(/\sname="([^"]+)"/)?.[1];
        const dynamicName = match[1].match(/:name="`([^`]+)`"/)?.[1];
        if (!typed) slots.add(staticName ?? dynamicName ?? 'default');
    }
    return [...slots];
};

/*********************** Entry resolution ***********************/

// Resolve every export of an entry file to its kind and source
const resolveExports = (filePath, seen = new Set()) => {
    if (seen.has(filePath)) return [];
    seen.add(filePath);
    const source = loadSource(filePath);
    const exported = [];

    for (const statement of source.sourceFile.statements) {
        // Re-exports: export { a, default as B } from './x'
        if (ts.isExportDeclaration(statement) && statement.moduleSpecifier) {
            const target = resolveModule(filePath, statement.moduleSpecifier.text);
            if (!target) continue;
            if (!statement.exportClause) {
                exported.push(...resolveExports(target, seen));
                continue;
            }
            for (const element of statement.exportClause.elements) {
                const exportedName = element.name.text;
                const importedName = element.propertyName?.text ?? exportedName;
                const typeOnly = statement.isTypeOnly || element.isTypeOnly;
                if (target.endsWith('.vue') && !typeOnly) {
                    exported.push({ name: exportedName, kind: 'component', file: target });
                } else if (target.endsWith('index.ts') && !findDeclaration(loadSource(target), importedName)) {
                    exported.push(...resolveExports(target, new Set()).filter(item => item.name === importedName).map(item => ({ ...item, name: exportedName })));
                } else {
                    exported.push(describeDeclaration(loadSource(target), importedName, exportedName, typeOnly));
                }
            }
            continue;
        }

        // Local declarations: export const / interface / type / function
        const isExported = statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
        if (!isExported) continue;
        if (ts.isVariableStatement(statement)) {
            for (const declaration of statement.declarationList.declarations) {
                exported.push(describeDeclaration(source, declaration.name.getText(source.sourceFile)));
            }
        } else if ((ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement) || ts.isFunctionDeclaration(statement)) && statement.name) {
            exported.push(describeDeclaration(source, statement.name.text));
        }
    }
    return exported.filter(Boolean);
};

// Describe a non-component export (function, constant, or type)
const describeDeclaration = (source, name, exportedName = name, typeOnly = false) => {
    const declaration = findDeclaration(source, name);
    const text = node => node.getText(source.sourceFile);
    if (!declaration) return { name: exportedName, kind: typeOnly ? 'type' : 'value', signature: '' };

    // Interfaces list their members
    if (ts.isInterfaceDeclaration(declaration)) {
        const members = declaration.members.map(member => `    ${oneLine(text(member)).replace(/;$/, '')};`);
        const heritage = declaration.heritageClauses ? ` ${oneLine(declaration.heritageClauses.map(text).join(' '))}` : '';
        const generics = declaration.typeParameters ? `<${declaration.typeParameters.map(text).join(', ')}>` : '';
        return { name: exportedName, kind: 'type', signature: `interface ${exportedName}${generics}${heritage} {\n${members.join('\n')}\n}` };
    }
    if (ts.isTypeAliasDeclaration(declaration)) {
        const generics = declaration.typeParameters ? `<${declaration.typeParameters.map(text).join(', ')}>` : '';
        return { name: exportedName, kind: 'type', signature: `type ${exportedName}${generics} = ${oneLine(text(declaration.type))}` };
    }
    if (ts.isFunctionDeclaration(declaration)) {
        const returnType = declaration.type ? `: ${oneLine(text(declaration.type))}` : '';
        return { name: exportedName, kind: 'function', signature: `function ${exportedName}(${declaration.parameters.map(p => oneLine(text(p))).join(', ')})${returnType}` };
    }

    // Arrow functions become signatures; other constants show their annotated type
    const initializer = declaration.initializer;
    if (initializer && (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))) {
        const asyncPrefix = initializer.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.AsyncKeyword) ? 'async ' : '';
        const returnType = initializer.type ? `: ${oneLine(text(initializer.type))}` : '';
        return { name: exportedName, kind: 'function', signature: `${asyncPrefix}function ${exportedName}(${initializer.parameters.map(p => oneLine(text(p))).join(', ')})${returnType}` };
    }
    const annotation = declaration.type ? `: ${oneLine(text(declaration.type))}` : '';
    return { name: exportedName, kind: 'value', signature: `const ${exportedName}${annotation}` };
};

/*********************** Rendering ***********************/

// Render one component's API
const renderComponent = (name, file) => {
    const source = loadSource(file);
    const { props, extendsTypes: propExtends } = readProps(source);
    const { emits, extendsTypes: emitExtends } = readEmits(source);
    const slots = readSlots(source);
    const lines = [`#### \`${name}\``, ''];

    // Props table (a lone class prop gets a compact line instead)
    if (props.length === 1 && props[0].name === 'class') {
        lines.push('- **Props:** `class`.');
    } else if (props.length) {
        lines.push('| Prop | Type | Default |', '| --- | --- | --- |');
        for (const prop of props) {
            lines.push(`| \`${prop.name}\`${prop.required ? ' *(required)*' : ''} | \`${cell(prop.type)}\` | ${prop.default ? `\`${cell(prop.default)}\`` : ''} |`);
        }
        lines.push('');
    }
    if (propExtends.length) lines.push(`- **Also accepts** all props of ${[...new Set(propExtends)].join(', ')}.`);
    if (!props.length && !propExtends.length) lines.push('- **Props:** none.');

    // Emits and slots
    const emitText = emits.map(emit => `\`${emit.name}\`${emit.payload ? ` (${cell(emit.payload)})` : ''}`);
    if (emitExtends.length) emitText.push(`all events of ${[...new Set(emitExtends)].join(', ')}`);
    if (emitText.length) lines.push(`- **Emits:** ${emitText.join(', ')}.`);
    if (slots.length) lines.push(`- **Slots:** ${slots.map(slot => `\`${slot}\``).join(', ')}.`);
    return lines.join('\n');
};

// Render one package entry point
const renderEntry = (key, filePath) => {
    const meta = entryMeta[key];
    const importPath = `${packageName}/${key}`;
    // Default exports are aliases of named ones, so only named exports are documented
    const exported = resolveExports(filePath).filter(item => item.name !== 'default');
    const components = exported.filter(item => item.kind === 'component');
    const others = exported.filter(item => item.kind !== 'component');
    const lines = [`### \`${importPath}\``, '', meta.description, ''];

    // Import line
    const importable = exported.filter(item => item.kind !== 'type').map(item => item.name);
    const typeNames = exported.filter(item => item.kind === 'type').map(item => item.name);
    if (importable.length || typeNames.length) {
        lines.push('```ts');
        if (importable.length) lines.push(`import { ${importable.join(', ')} } from '${importPath}';`);
        if (typeNames.length) lines.push(`import type { ${typeNames.join(', ')} } from '${importPath}';`);
        lines.push('```', '');
    }

    // Curated usage example
    if (meta.example) {
        lines.push('```' + (meta.exampleLang ?? 'vue'), meta.example.trim(), '```', '');
    }

    // Components
    for (const component of components) {
        lines.push(renderComponent(component.name, component.file), '');
    }

    // Functions, constants, and types
    if (others.length) {
        lines.push('#### Functions, constants, and types', '', '```ts');
        for (const item of others) lines.push(item.signature || `${item.kind} ${item.name}`);
        lines.push('```', '');
    }
    return lines.join('\n').trim();
};

// Anchor for a heading such as `@brumaombra/ui-vintage/button`
const anchorOf = key => `${packageName}/${key}`.toLowerCase().replace(/[^a-z0-9 -]/g, '');

/*********************** Main ***********************/

const entryKeys = Object.keys(packageJson.exports).filter(key => key.startsWith('./') && key !== './style.css').map(key => key.slice(2));

// Every entry point needs metadata, and every metadata entry needs an entry point
const missingMeta = entryKeys.filter(key => !entryMeta[key]);
const staleMeta = Object.keys(entryMeta).filter(key => !entryKeys.includes(key));
if (missingMeta.length || staleMeta.length) {
    if (missingMeta.length) console.error(`Missing metadata in scripts/components-meta.mjs for: ${missingMeta.join(', ')}`);
    if (staleMeta.length) console.error(`Metadata without a package.json export: ${staleMeta.join(', ')}`);
    process.exit(1);
}

// Group entries by category, preserving the category order
const sections = categories.map(category => ({
    ...category,
    keys: entryKeys.filter(key => entryMeta[key].category === category.id).sort()
}));

const header = `# UI Vintage component catalog

> Generated by \`npm run docs:components\` from the source of \`${packageName}\`. Do not edit by hand.

This file lists every public entry point of the package with its components, props, events, slots, and helpers. It ships inside the npm package, so it always matches the installed version: \`node_modules/${packageName}/COMPONENTS.md\`.

## Ground rules

- Register the Nuxt module once in \`nuxt.config\`: \`modules: ['${packageName}']\`. It injects the stylesheet, installs \`@nuxt/image\`, and merges the library translations into vue-i18n.
- Import from explicit subpaths only (for example \`${packageName}/button\`). There is no root barrel, and \`src/\` paths are internal.
- Style with the semantic Tailwind tokens: \`bg-background\`, \`bg-card\`, \`bg-surface\`, \`bg-accent\`, \`bg-primary\`, \`hover:bg-primary-hover\`, \`text-foreground\`, \`text-muted-foreground\`, \`border-border\`, \`border-border-strong\`, \`text-destructive\`, \`text-success\`, \`text-warning\`, \`text-info\`. They switch automatically in dark mode, so do not add \`dark:\` color overrides.
- Reuse the motion utilities from the stylesheet instead of custom animations: \`ease-spring\`, \`ease-bounce\`, \`ease-out-expo\`, \`ease-snappy\`, \`uv-floating-motion\`, \`uv-modal-motion\`, \`uv-overlay-motion\`, \`uv-collapsible-motion\`, \`uv-field\`, \`animate-uv-pop\`, \`animate-uv-fade-up\`, \`animate-uv-shake\`, \`animate-uv-shimmer\`, \`animate-uv-float\`, \`animate-uv-ping-soft\`, and elevation via \`shadow-elevated-sm|md|lg|xl\`. Tailwind v4 animates \`scale\`, \`rotate\`, and \`translate\` as separate properties, so name them (not \`transform\`) in custom transitions.
- Icons are Hugeicons definitions passed as values: \`import { Rocket01Icon } from '@hugeicons/core-free-icons'\` then \`:icon="Rocket01Icon"\`, or render one with \`<HugeiconsIcon :icon="Rocket01Icon" />\` from \`@hugeicons/vue\`.
- Every component accepts \`class\`, merged with \`tailwind-merge\`, so utility overrides win over the defaults.`;

const toc = ['## Contents', ''];
for (const section of sections) {
    toc.push(`- **${section.title}:** ${section.keys.map(key => `[${key}](#${anchorOf(key)})`).join(', ')}`);
}

const body = sections.map(section => [`## ${section.title}`, '', section.description, '', section.keys.map(key => renderEntry(key, join(root, packageJson.exports[`./${key}`]))).join('\n\n---\n\n')].join('\n'));
const output = [header, toc.join('\n'), ...body].join('\n\n').replace(/\n{3,}/g, '\n\n');

// Check mode compares without writing
if (process.argv.includes('--check')) {
    const current = existsSync(outputPath) ? readFileSync(outputPath, 'utf8').replace(/\r\n/g, '\n') : '';
    if (current !== output) {
        console.error('COMPONENTS.md is out of date. Run `npm run docs:components` and commit the result.');
        process.exit(1);
    }
    console.log('COMPONENTS.md is up to date.');
} else {
    writeFileSync(outputPath, output);
    console.log(`Wrote ${relative(root, outputPath)} (${entryKeys.length} entry points).`);
}