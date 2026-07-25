import * as vscode from 'vscode';
export declare class AemFormsCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.CompletionItem[]>;
    private getRootItems;
    private getTopLevelItems;
    private getSubNamespaceFunctions;
    private createCompletionItem;
}
//# sourceMappingURL=completion.d.ts.map