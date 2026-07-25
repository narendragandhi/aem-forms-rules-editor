import * as vscode from 'vscode';
import { AemFormsCompletionProvider } from './completion';
import { AemFormsHoverProvider } from './hover';
import { AemFormsSignatureProvider } from './signature';

export function activate(context: vscode.ExtensionContext) {
    console.log('AEM Forms Rules Editor extension activating...');

    const selector: vscode.DocumentSelector = [
        { language: 'javascript', scheme: 'file' },
        { language: 'typescript', scheme: 'file' },
        { language: 'aem-forms-rules', scheme: 'file' }
    ];

    // Completion provider — triggers on "."
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        selector,
        new AemFormsCompletionProvider(),
        '.'
    );

    // Hover provider
    const hoverProvider = vscode.languages.registerHoverProvider(
        selector,
        new AemFormsHoverProvider()
    );

    // Signature help — triggers on "(" and ","
    const signatureProvider = vscode.languages.registerSignatureHelpProvider(
        selector,
        new AemFormsSignatureProvider(),
        '(', ','
    );

    context.subscriptions.push(completionProvider, hoverProvider, signatureProvider);

    console.log('AEM Forms Rules Editor: 101 functions registered (completion, hover, signature)');
}

export function deactivate() {}
