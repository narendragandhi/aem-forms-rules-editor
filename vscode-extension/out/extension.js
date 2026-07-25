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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const completion_1 = require("./completion");
const hover_1 = require("./hover");
const signature_1 = require("./signature");
function activate(context) {
    console.log('AEM Forms Rules Editor extension activating...');
    const selector = [
        { language: 'javascript', scheme: 'file' },
        { language: 'typescript', scheme: 'file' },
        { language: 'aem-forms-rules', scheme: 'file' }
    ];
    // Completion provider — triggers on "."
    const completionProvider = vscode.languages.registerCompletionItemProvider(selector, new completion_1.AemFormsCompletionProvider(), '.');
    // Hover provider
    const hoverProvider = vscode.languages.registerHoverProvider(selector, new hover_1.AemFormsHoverProvider());
    // Signature help — triggers on "(" and ","
    const signatureProvider = vscode.languages.registerSignatureHelpProvider(selector, new signature_1.AemFormsSignatureProvider(), '(', ',');
    context.subscriptions.push(completionProvider, hoverProvider, signatureProvider);
    console.log('AEM Forms Rules Editor: 101 functions registered (completion, hover, signature)');
}
function deactivate() { }
//# sourceMappingURL=extension.js.map