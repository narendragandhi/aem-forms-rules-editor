#!/usr/bin/env node

/**
 * Build and validate the public client-side function catalog.
 *
 * The AEM client library JSDoc and assignments are the canonical API surface.
 * The VS Code catalog remains richer (examples and editor-specific metadata),
 * but this command prevents its function names and signatures from drifting.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsRoot = path.join(root, 'ui.apps/src/main/content/jcr_root/apps/aem-forms-rules-editor/clientlibs/clientlib-custom-functions/js');
const extensionCatalog = path.join(root, 'vscode-extension/src/functions.ts');
const output = path.join(root, 'docs/function-catalog.json');

const categories = {
    'validation.js': 'Validation',
    'formatting.js': 'Formatting',
    'financial.js': 'Financial',
    'date-utils.js': 'Date/Time',
    'string-utils.js': 'Strings',
    'data-utils.js': 'Data',
    'geolocation.js': 'Geolocation',
    'file-utils.js': 'Files',
    'xfa-form.js': 'XFA Form',
    'xfa-instance.js': 'XFA Instances',
    'xfa-layout.js': 'XFA Layout',
    'xfa-formcalc.js': 'FormCalc',
    'xfa-acrobat.js': 'Acrobat API',
    'correspondence.js': 'Correspondence Management',
    'document-of-record.js': 'Document of Record',
    'forms-portal.js': 'Forms Portal'
};

function parseFunctions() {
    const functions = [];
    for (const file of fs.readdirSync(jsRoot).filter((name) => name.endsWith('.js')).sort()) {
        if (file === 'custom-functions.js') continue;
        const source = fs.readFileSync(path.join(jsRoot, file), 'utf8');
        const assignment = /(?:window\.(CustomFormRules(?:\.[A-Za-z0-9_$]+)*)|xfa)\.([A-Za-z0-9_$]+)\s*=\s*function(?:\s+[A-Za-z0-9_$]+)?\s*\(([^)]*)\)\s*\{/g;
        let match;
        while ((match = assignment.exec(source)) !== null) {
            const prefix = source.slice(0, match.index);
            const docStart = prefix.lastIndexOf('/**');
            const docEnd = prefix.lastIndexOf('*/');
            const doc = docStart < docEnd ? prefix.slice(docStart, docEnd + 2) : '';
            const namespace = match[1] ? `${match[1]}.${match[2]}` : `CustomFormRules.xfa.${match[2]}`;
            const name = match[2];
            const params = (match[3].trim() ? match[3].split(',') : []).map((param) => ({
                name: param.trim(),
                type: findParam(doc, param.trim())?.type ?? 'unknown',
                optional: false,
                description: findParam(doc, param.trim())?.description ?? ''
            }));
            const returnDef = doc.match(/@returns?\s+\{([^}]+)\}\s*(.*)/);
            functions.push({
                name,
                namespace,
                category: categories[file] ?? 'Other',
                source: `ui.apps/.../clientlib-custom-functions/js/${file}`,
                params,
                returns: returnDef?.[1] ?? 'unknown',
                description: findDescription(doc),
                isAsync: /\bPromise\b/.test(source.slice(match.index, source.indexOf('\n};', match.index)))
            });
        }
    }
    return functions;
}

function findDescription(doc) {
    const lines = doc.replace(/^\/\*\*|\*\/$/g, '').split('\n')
        .map((line) => line.replace(/^\s*\*\s?/, '').trim())
        .slice(0, (doc.match(/\n\s*\*\s*@/)?.index ?? Number.MAX_SAFE_INTEGER))
        .filter(Boolean);
    return lines.join(' ').replace(/\s+/g, ' ').trim();
}

function findParam(doc, name) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = doc.match(new RegExp(`@param\\s+\\{([^}]+)\\}\\s+\\[?${escaped}\\]?\\s*(.*)`));
    return match ? { type: match[1], description: match[2].trim().replace(/^-\s*/, '') } : undefined;
}

function extensionNamespaces() {
    const source = fs.readFileSync(extensionCatalog, 'utf8');
    return [...source.matchAll(/namespace:\s*["']([^"']+)["']/g)].map((match) => match[1]);
}

function canonical(value) {
    return JSON.stringify(value, null, 2) + '\n';
}

function main() {
    const args = new Set(process.argv.slice(2));
    const catalog = parseFunctions();
    const aemNamespaces = new Set(catalog.map((entry) => entry.namespace));
    const vscodeNamespaces = new Set(extensionNamespaces());
    const missingInVscode = [...aemNamespaces].filter((name) => !vscodeNamespaces.has(name));
    const missingInAem = [...vscodeNamespaces].filter((name) => !aemNamespaces.has(name));
    const duplicateAem = catalog.map((entry) => entry.namespace).filter((name, index, all) => all.indexOf(name) !== index);

    if (args.has('--write')) {
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(output, canonical(catalog));
        console.log(`Wrote ${catalog.length} functions to ${path.relative(root, output)}`);
    }

    if (args.has('--check')) {
        const expected = canonical(catalog);
        const actual = fs.existsSync(output) ? fs.readFileSync(output, 'utf8') : '';
        if (expected !== actual) console.error(`${path.relative(root, output)} is out of date; run npm run catalog:generate`);
        if (missingInVscode.length) console.error(`Missing from VS Code catalog: ${missingInVscode.join(', ')}`);
        if (missingInAem.length) console.error(`Missing from AEM client library: ${missingInAem.join(', ')}`);
        if (duplicateAem.length) console.error(`Duplicate AEM functions: ${duplicateAem.join(', ')}`);
        if (expected !== actual || missingInVscode.length || missingInAem.length || duplicateAem.length) process.exitCode = 1;
        else console.log(`Catalog is synchronized: ${catalog.length} AEM functions and ${vscodeNamespaces.size} VS Code functions.`);
    }

    if (!args.has('--write') && !args.has('--check')) {
        console.error('Usage: generate-function-catalog.mjs --write|--check');
        process.exitCode = 2;
    }
}

main();
