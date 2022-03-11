/// <reference types="ts-expose-internals" />

// check for any possible expression or identifier with
// an @type comment on it
// wrapped in parentheses (parens will be outside of the expression's span)

// Check that comment is *only* @type and has nothing else
// Wrap type in parens.  Wrap expression in parens
// wrap both in type assertion node

import _, { sortBy } from 'lodash';
import {JSDocParameterTag, JSDocReturnTag, JSDocTemplateTag, SyntaxKind, ts, TypeParameterDeclarationStructure} from 'ts-morph';
import type * as _ts from 'typescript';
import { parser, repeat, wrapTransformer } from '../helpers';
import { createJsDocHelpers, Operation } from './helpers/jsdoc';
export {parser};

export default wrapTransformer(function({sourceFile}) {
    const {applyOperations, removeJsDoc, removeJsDocTag} = createJsDocHelpers(sourceFile);
    repeat(() => sourceFile.forEachDescendant((node, traversal) => {
        // Transform `/** @type {Foo} */var foo = `
        const varStatement = node.asKind(SyntaxKind.VariableStatement);
        if(varStatement) {
            const _varStatement = varStatement?.compilerNode as _ts.VariableStatement;
            const jsDocs = _varStatement?.jsDoc;
            if(varStatement && jsDocs?.length === 1 && varStatement.getDeclarationList().getDeclarations().length === 1) {
                const jsDoc = jsDocs[0];
                const typeTag = jsDoc.tags?.find(t => t.tagName.getText() === 'type') as _ts.JSDocTypeTag;
                if(typeTag) {
                    const nameNode = varStatement.getDeclarationList().getDeclarations()[0].compilerNode.name;
                    const typeAnnotationPosition = nameNode.getStart() + nameNode.getText().length;
                    const typeAnnotation = `: ${typeTag.typeExpression.type.getText()}`;
                    sourceFile.insertText(typeAnnotationPosition, typeAnnotation);
                    if(jsDoc.tags!.length > 1 || jsDoc.comment || typeTag.comment) {
                        // jsdoc is not empty
                        removeJsDocTag(jsDoc, typeTag, true).doIt();
                    } else {
                        removeJsDoc(jsDoc, _varStatement).doIt();
                    }
                    return repeat.CONTINUE;
                }
            }
        }

        // Transform JSDoc on functions
        const functionExpression = node.asKind(SyntaxKind.FunctionExpression);
        const functionDeclaration = node.asKind(SyntaxKind.FunctionDeclaration);
        if(functionExpression || functionDeclaration) {
            const fn = (functionExpression ?? functionDeclaration)!;
            // check for jsdoc in a variety of places
            let jsDoc = (functionExpression?.getJsDocs() ?? functionDeclaration?.getJsDocs())?.[0];
            if(jsDoc) {
                let didStuff = false;
                const operations: Operation[] = [];

                const templates = (jsDoc.getTags().filter(t => t.getTagName() === 'template') ?? []) as JSDocTemplateTag[];

                const typeParamDeclStructures: TypeParameterDeclarationStructure[] = [];
                for(const template of templates) {
                    for(const typeParam of template.getTypeParameters()) {
                        if(!fn.getTypeParameter(typeParam.getName())) {
                            typeParamDeclStructures.push({
                                ...typeParam.getStructure(),
                                constraint: template.getConstraint()?.getTypeNode().getText()
                            });
                            didStuff = true;
                        }
                    }
                    operations.push(removeJsDocTag(jsDoc.compilerNode as _ts.JSDoc, template.compilerNode as _ts.JSDocTemplateTag, true));
                }
                fn.addTypeParameters(typeParamDeclStructures);

                const params = new Map<string, JSDocParameterTag>();
                for(const tag of jsDoc.getTags() ?? []) {
                    if(tag.getTagName() === 'param' && (tag as JSDocParameterTag).getTypeExpression()) {
                        const _tag = tag as JSDocParameterTag;
                        params.set(_tag.getName(), _tag);
                        fn.getParameter(_tag.getName())?.setType(_tag.getTypeExpression()?.getTypeNode().getText()!);
                        operations.push(removeJsDocTag(jsDoc.compilerNode as _ts.JSDoc, tag.compilerNode as _ts.JSDocParameterTag, true));
                    }
                }


                const returnType = jsDoc.getTags()?.find(t => ['return', 'returns'].includes(t.getTagName())) as JSDocReturnTag;
                if(returnType && returnType.getTypeExpression()) {
                    if(!fn.getReturnTypeNode()) {
                        // TODO handle `@returns {*}` -> `any`
                        fn.setReturnType(returnType.getTypeExpression()?.getTypeNode().getText()!);
                        didStuff = true;
                    } else {
                        operations.push(removeJsDocTag(jsDoc.compilerNode as _ts.JSDoc, returnType.compilerNode as _ts.JSDocReturnTag, true));
                    }
                }

                didStuff = applyOperations(operations) || didStuff;
                if(didStuff) return repeat.CONTINUE;
            }
        }
    }) || repeat.BREAK);
    return sourceFile.getFullText();
});

