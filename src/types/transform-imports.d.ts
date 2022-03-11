declare module 'transform-imports' {
    export = _export;

    function _export(source: string, cb: (importDefs: Array<ImportDefinition>) => void, options?: Options): string;

    interface ImportDefinition {
        variableName?: string;
        source?: string;
        importedExport: {
            name: string,
            isImportedAsCJS: boolean,
        };
        kind: "value" | "type" | "typeof",
        isDynamicImport: boolean,
        path: InstanceType<typeof NodePath>,
        
        remove(): void;
        fork(arg?: { insert: "before" | "after" }): void;
    }

    interface Options {
        parser?: TODO;
    }
}
