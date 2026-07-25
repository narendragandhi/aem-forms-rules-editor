"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AemFormsCompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
const functions_1 = require("./functions");
class AemFormsCompletionProvider {
    provideCompletionItems(document, position) {
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
    getRootItems() {
        const item = new vscode.CompletionItem('CustomFormRules', vscode.CompletionItemKind.Module);
        item.detail = 'AEM Forms Rules Editor';
        item.documentation = 'AEM Forms Rules Editor — 101 custom functions for Adaptive Forms and XFA IC fragments.';
        item.insertText = 'CustomFormRules';
        return [item];
    }
    getTopLevelItems(filter) {
        const items = [];
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
        const topFunctions = functions_1.FUNCTIONS.filter(f => !f.namespace.includes('.xfa.') && !f.namespace.includes('.formsPortal.') && !f.namespace.includes('.documentOfRecord.') && !f.namespace.includes('.correspondence.'));
        for (const fn of topFunctions) {
            if (!filterLower || fn.name.toLowerCase().startsWith(filterLower)) {
                items.push(this.createCompletionItem(fn));
            }
        }
        return items;
    }
    getSubNamespaceFunctions(namespace, filter) {
        const items = [];
        const filterLower = filter.toLowerCase();
        const namespaceMap = {
            'xfa': 'CustomFormRules.xfa',
            'formsPortal': 'CustomFormRules.formsPortal',
            'documentOfRecord': 'CustomFormRules.documentOfRecord',
            'correspondence': 'CustomFormRules.correspondence'
        };
        const nsPrefix = namespaceMap[namespace];
        if (!nsPrefix) {
            return items;
        }
        const nsFunctions = functions_1.FUNCTIONS.filter(f => f.namespace.startsWith(nsPrefix + '.'));
        for (const fn of nsFunctions) {
            if (!filterLower || fn.name.toLowerCase().startsWith(filterLower)) {
                items.push(this.createCompletionItem(fn));
            }
        }
        return items;
    }
    createCompletionItem(fn) {
        const item = new vscode.CompletionItem(fn.name, vscode.CompletionItemKind.Function);
        item.detail = `(${fn.params.map(p => p.name).join(', ')}) → ${fn.returns}`;
        item.documentation = new vscode.MarkdownString()
            .appendMarkdown(`**${fn.category}**\n\n`)
            .appendMarkdown(`${fn.description}\n\n`)
            .appendMarkdown(`Returns: \`${fn.returns}\``)
            .appendMarkdown(fn.isAsync ? ' *(async)*' : '');
        // Build snippet with tab stops
        const snippetParts = [];
        for (let i = 0; i < fn.params.length; i++) {
            const p = fn.params[i];
            if (p.optional) {
                snippetParts.push(`\${${i + 1}:${p.name}}`);
            }
            else {
                snippetParts.push(`\${${i + 1}:${p.name}}`);
            }
        }
        item.insertText = new vscode.SnippetString(`${fn.name}(${snippetParts.join(', ')})`);
        // Category-based sorting
        item.sortText = `${fn.category}_${fn.name}`;
        return item;
    }
}
exports.AemFormsCompletionProvider = AemFormsCompletionProvider;
//# sourceMappingURL=completion.js.map