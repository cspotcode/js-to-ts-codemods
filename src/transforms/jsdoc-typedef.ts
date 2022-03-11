/// <reference types="ts-expose-internals" />

// check for any possible expression or identifier with
// an @type comment on it
// wrapped in parentheses (parens will be outside of the expression's span)

// Check that comment is *only* @type and has nothing else
// Wrap type in parens.  Wrap expression in parens
// wrap both in type assertion node

import _, { sortBy } from 'lodash';
import {createWrappedNode, JSDocParameterTag, JSDocReturnTag, JSDocTemplateTag, JSDocTypeLiteral, SyntaxKind, ts, TypeParameterDeclarationStructure} from 'ts-morph';
import type * as _ts from 'typescript';
import { parser, repeat, wrapTransformer } from '../helpers';
import { createJsDocHelpers, Operation } from './helpers/jsdoc';
export {parser};

export default wrapTransformer(function({sourceFile}) {
    const {applyOperations, removeJsDoc, removeJsDocTag} = createJsDocHelpers(sourceFile);
    repeat(() => sourceFile.forEachDescendant((node, traversal) => {
        const jsDocs = (node as any).compilerNode.jsDoc as undefined | Array<_ts.JSDoc>;
        for(const jsDoc of jsDocs ?? []) {
            const typedefTag = jsDoc.tags?.find(t => t.tagName.getText() === 'typedef') as _ts.JSDocTypedefTag | undefined;
            const exportsTag = jsDoc.tags?.find(t => t.tagName.getText() === 'exports') as _ts.JSDocTag | undefined;
            if(typedefTag) {
                if(jsDoc.tags!.length !== (typedefTag ? 1 : 0) + (exportsTag ? 1 : 0)) throw new Error('not supported');
                if(jsDoc.comment) throw new Error('not supported');

                const operations: Operation[] = [];
                if(exportsTag) operations.push(removeJsDocTag(jsDoc, exportsTag, false));
                const type = (typedefTag.typeExpression as _ts.JSDocTypeExpression).type;
                if(!type) throw new Error('not supported');
                const isTypeLiteral = type.kind === SyntaxKind.TypeLiteral;
                const typeDeclaration = `\n${
                    exportsTag ? 'export ' : ''
                }${
                    isTypeLiteral ? `interface ` : `type `
                }${
                    typedefTag.name?.getFullText()
                }${
                    isTypeLiteral ? ' ' : ' = '
                }${
                    type.getFullText().replace(/(\n *)\*/g, '$1')
                };`;
                    //typedefTag.typeExpression?.getFullText().replace(/^\{([\s\S]*)\}$/, '$1').replace(/(\n *)\*/g, '$1')
                operations.push(removeJsDocTag(jsDoc, typedefTag, true));
                operations.push({
                    start: jsDoc.getEnd(),
                    doIt() {
                        sourceFile.insertText(this.start, typeDeclaration);
                        return true;
                    }
                });
                applyOperations(operations);
                return repeat.CONTINUE;
            }
        }
    }) || repeat.BREAK);
    return sourceFile.getFullText();
});

