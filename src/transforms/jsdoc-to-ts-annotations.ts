/// <reference types="ts-expose-internals" />

// check for any possible expression or identifier with
// an @type comment on it
// wrapped in parentheses (parens will be outside of the expression's span)

// Check that comment is *only* @type and has nothing else
// Wrap type in parens.  Wrap expression in parens
// wrap both in type assertion node

import { FunctionExpression } from 'jscodeshift';
import {SyntaxKind} from 'ts-morph';
import type * as _ts from 'typescript';
import { parser, repeat, wrapTransformer } from '../helpers';
export {parser};

export default wrapTransformer(function({j, sourceFile}) {
    repeat(() => sourceFile.forEachDescendant((node) => {

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
        const _functionExpression = functionExpression?.compilerNode as _ts.FunctionExpression;
        const functionDeclaration = node.asKind(SyntaxKind.FunctionDeclaration);
        const _functionDeclaration = functionDeclaration?.compilerNode as _ts.FunctionDeclaration;
        if(functionExpression || functionDeclaration) {
            const fn = (functionExpression ?? functionDeclaration)!;
            // check for jsdoc in a variety of places
            let jsDoc = (_functionExpression.jsDoc ?? _functionDeclaration.jsDoc)?.[0];
            if(jsDoc) {
                const operations: Operation[] = [];

                const templates = (jsDoc.tags?.filter(t => t.tagName.getText() === 'template') ?? []) as _ts.JSDocTemplateTag[];
                if(templates.length && fn.compilerNode.typeParameters) throw new Error(`not supported: ${sourceFile.getFilePath()}:${fn.getStartLineNumber()}`);
                const typeParamNames: string[] = [];
                for(const template of templates) {
                    for(const typeParam of template.typeParameters) {
                        if(typeParam.constraint) throw new Error(`not supported`);
                        typeParamNames.push(typeParam.name.getText());
                    }
                }
                fn.addTypeParameters // TODO via "Structures"??

                const params = new Map<string, _ts.JSDocParameterTag>();
                for(const tag of jsDoc.tags ?? []) {
                    if(tag.tagName.getText() === 'param' && (tag as _ts.JSDocParameterTag).typeExpression) {
                        const _tag = tag as _ts.JSDocParameterTag;
                        params.set(_tag.name.getText(), _tag);
                    }
                }


                const returnType = jsDoc.tags?.find(t => ['return', 'returns'].includes(t.tagName.getText())) as _ts.JSDocReturnTag;
                if(returnType && returnType.typeExpression) {
                    fn.setReturnType(returnType.typeExpression?.type!.getText());
            }
        }
    }) || repeat.BREAK);
    return sourceFile.getFullText();

    interface Operation {
        start: number;
        doIt(): void;
    }
    function removeJsDocTag(jsDoc: _ts.JSDoc, tag: _ts.JSDocTag, keepComment: boolean) {
        let start = tag.getStart();
        let end = tag.getEnd();
        const replacement = keepComment && tag.comment as string || '';
        // if(sourceFile.getFullText().slice(replaceStart - 3, replaceStart) === ' * ') replaceStart -= 2;
        function doIt() {
            sourceFile.replaceText([start, end], replacement);
        }
        return {doIt, start, end, replacement};
    }
    function removeJsDoc(jsDoc: _ts.JSDoc, attachedTo: _ts.Node) {
        const start = jsDoc.getStart();
        const end = attachedTo.getStart();
        function doIt() {
            sourceFile.removeText(start, end);
        }
        return {doIt, start, end};
    }
});

