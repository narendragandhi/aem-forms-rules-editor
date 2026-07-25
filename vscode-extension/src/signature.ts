import * as vscode from 'vscode';
import { FUNCTIONS, FunctionDef } from './functions';

export class AemFormsSignatureProvider implements vscode.SignatureHelpProvider {
    provideSignatureHelp(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.SignatureHelp> {
        // Find the function call by scanning backward for the opening paren
        const lineText = document.lineAt(position).text;
        const textBefore = lineText.substring(0, position.character);

        // Find matching function name before the paren
        const match = textBefore.match(/CustomFormRules\.(?:xfa|formsPortal|documentOfRecord|correspondence)?\.?\w+(?=\s*\()$/);
        if (!match) { return null; }

        const funcName = match[0];
        const fn = FUNCTIONS.find(f => f.namespace === funcName || f.name === funcName.split('.').pop());
        if (!fn || fn.params.length === 0) { return null; }

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
            const paramInfo = new vscode.ParameterInformation(
                `${p.name}: ${p.type}`,
                new vscode.MarkdownString(`**${p.name}** (\`${p.type}\`${p.optional ? ', optional' : ''})\n\n${p.description}`)
            );
            sig.parameters.push(paramInfo);
        }

        sigHelp.signatures.push(sig);

        // Count commas to find active parameter
        let depth = 0;
        let paramIndex = 0;
        for (let i = textBefore.length - 1; i >= 0; i--) {
            const ch = textBefore[i];
            if (ch === ')') { depth++; }
            if (ch === '(') {
                if (depth === 0) { break; }
                depth--;
            }
            if (ch === ',' && depth === 0) { paramIndex++; }
        }

        sigHelp.activeParameter = Math.min(paramIndex, fn.params.length - 1);

        return sigHelp;
    }
}
