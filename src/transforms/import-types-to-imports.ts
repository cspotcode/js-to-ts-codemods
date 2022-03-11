import { NodePath } from 'ast-types';
import _, { matches, sortBy, isMatch, groupBy } from 'lodash';
import {DefaultClause, JSDocParameterTag, JSDocReturnTag, JSDocTemplateTag, SyntaxKind, ts, TypeParameterDeclarationStructure} from 'ts-morph';
import type * as _ts from 'typescript';
import { parser, repeat, wrapTransformer } from '../helpers';
import { createJsDocHelpers, Operation } from './helpers/jsdoc';
import transformImports from 'transform-imports';
import assert from 'assert';
export {parser};

export default wrapTransformer(function({fileInfo, sourceFile}) {
    const {applyOperations} = createJsDocHelpers(sourceFile);

    // https://github.com/suchipi/transform-imports
    let importDefs;
    transformImports(fileInfo.source, (_importDefs) => {
        importDefs = _importDefs;
    }, {parser});

    interface RequestedImport {
        specifier: string;
        name: string;
        namespace?: string | undefined;
    }
    const requestedImports: Array<RequestedImport> = [];
    const operations: Operation[] = [];
    sourceFile.forEachDescendant(node => {
        const importTypeNode = node.asKind(SyntaxKind.ImportType);
        if(importTypeNode) {
            const specifier = importTypeNode.getArgument().asKind(SyntaxKind.LiteralType)?.getLiteral().asKind(SyntaxKind.StringLiteral)?.getLiteralValue()!;
            const name = importTypeNode.getQualifier()?.getText()!;
            assert(name);
            const newRequestedImport = {specifier, name};
            let requestedImport = requestedImports.find(r => isMatch(r, newRequestedImport));
            if(!requestedImport) {
                requestedImport = newRequestedImport;
                requestedImports.push(requestedImport);
            }
            const start = importTypeNode.getStart();
            const end = importTypeNode.getQualifier()?.getStart()!;
            operations.push({
                start,
                end,
                requestedImport,
                doIt() {
                    sourceFile.replaceText([start, end], requestedImport?.namespace ? `${ requestedImport.namespace }.` : ``);
                    return true;
                }
            } as Operation);
        }
    });

    // TODO decide how to add each import

    // TODO the challenge is:
    //
    // 
    //
    //

    applyOperations(operations);

    const tasks: Function[] = [];
    const unAddedImports = requestedImports.filter(req =>
        !sourceFile.forEachChild(node => {
            const imp = node.asKind(SyntaxKind.ImportDeclaration);
            if(imp && !imp.getNamespaceImport() && imp.isTypeOnly()) {
                const specifier = imp.getModuleSpecifier().asKind(SyntaxKind.StringLiteral)?.getLiteralValue();
                if(specifier === req.specifier) {
                    const namedImport = imp.getImportClause()?.getNamedImports().find(v => !v.getAliasNode() && v.getName() === req.name);
                    if(!namedImport) {
                        tasks.push(() => imp.addNamedImport(req.name));
                        return true;
                    }
                }
            }
        })
    );

    for(const task of tasks) task();

    for(const [specifier, reqs] of Object.entries(groupBy(unAddedImports, i => i.specifier))) {
        sourceFile.addImportDeclaration({
            moduleSpecifier: specifier,
            namedImports: reqs.map(req => ({name: req.name})),
            isTypeOnly: true
        });
    }


    return sourceFile.getFullText();
});
