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
exports.AemFormsSignatureProvider = void 0;
const vscode = __importStar(require("vscode"));
const functions_1 = require("./functions");
class AemFormsSignatureProvider {
    provideSignatureHelp(document, position) {
        // Find the function call by scanning backward for the opening paren
        const lineText = document.lineAt(position).text;
        const textBefore = lineText.substring(0, position.character);
        // Find matching function name before the paren
        const match = textBefore.match(/CustomFormRules\.(?:xfa|formsPortal|documentOfRecord|correspondence)?\.?\w+(?=\s*\()$/);
        if (!match) {
            return null;
        }
        const funcName = match[0];
        const fn = functions_1.FUNCTIONS.find(f => f.namespace === funcName || f.name === funcName.split('.').pop());
        if (!fn || fn.params.length === 0) {
            return null;
        }
        const sigHelp = new vscode.SignatureHelp();
        sigHelp.activeSignature = 0;
        // Build signature string
        const paramStr = fn.params.map(p => {
            return p.optional ? `${p.name}?: ${p.type}` : `${p.name}: ${p.type}`;
        }).join(', ');
        const sig = new vscode.SignatureInformation(`${fn.name}(${paramStr}) → ${fn.returns}`);
        sig.documentation = new vscode.MarkdownString(fn.description);
        // Add parameter info
        for (const p of fn.params) {
            const paramInfo = new vscode.ParameterInformation(`${p.name}: ${p.type}`, new vscode.MarkdownString(`**${p.name}** (\`${p.type}\`${p.optional ? ', optional' : ''})\n\n${p.description}`));
            sig.parameters.push(paramInfo);
        }
        sigHelp.signatures.push(sig);
        // Count commas to find active parameter
        let depth = 0;
        let paramIndex = 0;
        for (let i = textBefore.length - 1; i >= 0; i--) {
            const ch = textBefore[i];
            if (ch === ')') {
                depth++;
            }
            if (ch === '(') {
                if (depth === 0) {
                    break;
                }
                depth--;
            }
            if (ch === ',' && depth === 0) {
                paramIndex++;
            }
        }
        sigHelp.activeParameter = Math.min(paramIndex, fn.params.length - 1);
        return sigHelp;
    }
}
exports.AemFormsSignatureProvider = AemFormsSignatureProvider;
//# sourceMappingURL=signature.js.map