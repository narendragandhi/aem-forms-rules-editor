import * as vscode from 'vscode';
import { FUNCTIONS, FunctionDef, CATEGORIES, getFunctionsByCategory } from './functions';

export class AemFormsCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        const lineText = document.lineAt(position).text;
        const textBefore = lineText.substring(0, position.character);

        // Match namespace patterns: CustomFormRules, CustomFormRules.xfa, etc.
        const topMatch = textBefore.match(/CustomFormRules\.(\w*)$/);
        const subMatch = textBefore.match(/CustomFormRules\.(\w+)\.(\w*)$/);

        if (subMatch) {
            return this.getSubNamespaceFunctions(subMatch[1], subMatch[2]);
        }

        if (topMatch) {
            return this.getTopLevelItems(topMatch[1]);
        }

        // Trigger on just "Custom" or "CustomFormRules"
        const rootMatch = textBefore.match(/Custom(FormRules?)?$/);
        if (rootMatch) {
            return this.getRootItems();
        }

        return [];
    }

    private getRootItems(): vscode.CompletionItem[] {
        const item = new vscode.CompletionItem('CustomFormRules', vscode.CompletionItemKind.Module);
        item.detail = 'AEM Forms Rules Editor';
        item.documentation = `AEM Forms Rules Editor — ${FUNCTIONS.length} custom functions for Adaptive Forms and XFA IC fragments.`;
        item.insertText = 'CustomFormRules';
        return [item];
    }

    private getTopLevelItems(filter: string): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];
        const filterLower = filter.toLowerCase();

        // Add namespace objects first
        const namespaces = [
            { name: 'xfa', desc: 'XFA IC Fragment functions (16 functions)', count: 16 },
            { name: 'formsPortal', desc: 'Forms Portal integration (13 functions)', count: 13 },
            { name: 'documentOfRecord', desc: 'Document of Record (9 functions)', count: 9 },
            { name: 'correspondence', desc: 'Correspondence Management (10 functions)', count: 10 }
        ];

        for (const ns of namespaces) {
            if (!filterLower || ns.name.toLowerCase().startsWith(filterLower)) {
                const item = new vscode.CompletionItem(ns.name, vscode.CompletionItemKind.Module);
                item.detail = `AEM Forms — ${ns.desc}`;
                item.documentation = ns.desc;
                item.insertText = ns.name;
                items.push(item);
            }
        }

        // Add top-level functions
        const topFunctions = FUNCTIONS.filter(f => !f.namespace.includes('.xfa.') && !f.namespace.includes('.formsPortal.') && !f.namespace.includes('.documentOfRecord.') && !f.namespace.includes('.correspondence.'));
        for (const fn of topFunctions) {
            if (!filterLower || fn.name.toLowerCase().startsWith(filterLower)) {
                items.push(this.createCompletionItem(fn));
            }
        }

        return items;
    }

    private getSubNamespaceFunctions(namespace: string, filter: string): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];
        const filterLower = filter.toLowerCase();
        const namespaceMap: Record<string, string> = {
            'xfa': 'CustomFormRules.xfa',
            'formsPortal': 'CustomFormRules.formsPortal',
            'documentOfRecord': 'CustomFormRules.documentOfRecord',
            'correspondence': 'CustomFormRules.correspondence'
        };

        const nsPrefix = namespaceMap[namespace];
        if (!nsPrefix) { return items; }

        const nsFunctions = FUNCTIONS.filter(f => f.namespace.startsWith(nsPrefix + '.'));
        for (const fn of nsFunctions) {
            if (!filterLower || fn.name.toLowerCase().startsWith(filterLower)) {
                items.push(this.createCompletionItem(fn));
            }
        }

        return items;
    }

    private createCompletionItem(fn: FunctionDef): vscode.CompletionItem {
        const item = new vscode.CompletionItem(fn.name, vscode.CompletionItemKind.Function);
        item.detail = `(${fn.params.map(p => p.name).join(', ')}) → ${fn.returns}`;
        item.documentation = new vscode.MarkdownString()
            .appendMarkdown(`**${fn.category}**\n\n`)
            .appendMarkdown(`${fn.description}\n\n`)
            .appendMarkdown(`Returns: \`${fn.returns}\``)
            .appendMarkdown(fn.isAsync ? ' *(async)*' : '');

        // Build snippet with tab stops
        const snippetParts: string[] = [];
        for (let i = 0; i < fn.params.length; i++) {
            const p = fn.params[i];
            if (p.optional) {
                snippetParts.push(`\${${i + 1}:${p.name}}`);
            } else {
                snippetParts.push(`\${${i + 1}:${p.name}}`);
            }
        }
        item.insertText = new vscode.SnippetString(`${fn.name}(${snippetParts.join(', ')})`);

        // Category-based sorting
        item.sortText = `${fn.category}_${fn.name}`;

        return item;
    }
}
