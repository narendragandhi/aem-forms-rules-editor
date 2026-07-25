export interface ParamDef {
    name: string;
    type: string;
    optional: boolean;
    description: string;
}
export interface FunctionDef {
    name: string;
    namespace: string;
    category: string;
    params: ParamDef[];
    returns: string;
    description: string;
    example: string;
    isAsync: boolean;
}
export declare const FUNCTIONS: FunctionDef[];
export declare const CATEGORIES: string[];
export declare function getFunctionsByCategory(category: string): FunctionDef[];
export declare function findFunction(name: string): FunctionDef | undefined;
export declare function getNamespaceRoots(): string[];
//# sourceMappingURL=functions.d.ts.map