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
exports.AemFormsHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const functions_1 = require("./functions");
class AemFormsHoverProvider {
    provideHover(document, position) {
        const wordRange = document.getWordRangeAtPosition(position, /CustomFormRules\.(?:xfa|formsPortal|documentOfRecord|correspondence)?\.?\w+/);
        if (!wordRange) {
            return null;
        }
        const word = document.getText(wordRange);
        const fn = findFunctionByNamespace(word);
        if (!fn) {
            return null;
        }
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
exports.AemFormsHoverProvider = AemFormsHoverProvider;
function findFunctionByNamespace(namespace) {
    // Try exact match first
    let fn = functions_1.FUNCTIONS.find(f => f.namespace === namespace);
    if (fn) {
        return fn;
    }
    // Try by name alone
    const name = namespace.split('.').pop() || '';
    fn = functions_1.FUNCTIONS.find(f => f.name === name);
    if (fn) {
        return fn;
    }
    // Try partial match (for when cursor is in the middle of the name)
    fn = functions_1.FUNCTIONS.find(f => namespace.startsWith(f.namespace));
    return fn;
}
//# sourceMappingURL=hover.js.map