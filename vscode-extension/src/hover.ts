import * as vscode from 'vscode';
import { FUNCTIONS, FunctionDef } from './functions';

export class AemFormsHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.Hover> {
        const wordRange = document.getWordRangeAtPosition(position, /CustomFormRules\.(?:xfa|formsPortal|documentOfRecord|correspondence)?\.?\w+/);
        if (!wordRange) { return null; }

        const word = document.getText(wordRange);
        const fn = findFunctionByNamespace(word);
        if (!fn) { return null; }

        const md = new vscode.MarkdownString();
        md.isTrusted = true;

        // Function signature
        const paramStr = fn.params.map(p => {
            return p.optional ? `${p.name}?: ${p.type}` : `${p.name}: ${p.type}`;
        }).join(', ');
        md.appendMarkdown(`\`\`\`javascript\n${fn.name}(${paramStr}) → ${fn.returns}${fn.isAsync ? ' (async)' : ''}\n\`\`\`\n\n`);

        // Category badge
        md.appendMarkdown(`**${fn.category}** · AEM Forms Rules Editor\n\n`);

        // Description
        md.appendMarkdown(`${fn.description}\n\n`);

        // Parameters table
        if (fn.params.length > 0) {
            md.appendMarkdown(`**Parameters:**\n\n`);
            md.appendMarkdown(`| Name | Type | Optional | Description |\n`);
            md.appendMarkdown(`|------|------|----------|-------------|\n`);
            for (const p of fn.params) {
                md.appendMarkdown(`| \`${p.name}\` | \`${p.type}\` | ${p.optional ? 'yes' : 'no'} | ${p.description} |\n`);
            }
            md.appendMarkdown(`\n`);
        }

        // Return type
        md.appendMarkdown(`**Returns:** \`${fn.returns}\`\n\n`);

        // Example
        md.appendMarkdown(`**Example:**\n`);
        md.appendMarkdown(`\`\`\`javascript\n${fn.example}\n\`\`\`\n`);

        return new vscode.Hover(md, wordRange);
    }
}

function findFunctionByNamespace(namespace: string): FunctionDef | undefined {
    // Try exact match first
    let fn = FUNCTIONS.find(f => f.namespace === namespace);
    if (fn) { return fn; }

    // Try by name alone
    const name = namespace.split('.').pop() || '';
    fn = FUNCTIONS.find(f => f.name === name);
    if (fn) { return fn; }

    // Try partial match (for when cursor is in the middle of the name)
    fn = FUNCTIONS.find(f => namespace.startsWith(f.namespace));
    return fn;
}
