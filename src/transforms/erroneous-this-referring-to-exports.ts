/// <reference types="ts-expose-internals" />

// check for any possible expression or identifier with
// an @type comment on it
// wrapped in parentheses (parens will be outside of the expression's span)

// Check that comment is *only* @type and has nothing else
// Wrap type in parens.  Wrap expression in parens
// wrap both in type assertion node

import assert from 'assert';
import {Node, PropertyAccessExpression, SyntaxKind} from 'ts-morph';
import type * as _ts from 'typescript';
import { parser, repeat, wrapTransformer } from '../helpers';
export {parser};

export default wrapTransformer(function({sourceFile}) {
    repeat(() => sourceFile.forEachDescendant(node => {
        const propertyAccessExpression = node.asKind(SyntaxKind.PropertyAccessExpression);
        if(propertyAccessExpression) {
            const thisKeyword = propertyAccessExpression.getExpression().asKind(SyntaxKind.ThisKeyword);
            if(thisKeyword) {
                // Find the immediately containing function or class, since that determines the `this` value
                const thisScope = propertyAccessExpression.getFirstAncestor(node => !!(
                    node.asKind(SyntaxKind.FunctionDeclaration) ||
                    node.asKind(SyntaxKind.FunctionExpression) ||
                    node.asKind(SyntaxKind.MethodDeclaration) ||
                    node.asKind(SyntaxKind.ClassDeclaration)
                ));
                // we only care about exports, assuming they have already been refactored from CJS into proper ECMAScript export statements
                const fnDecl = thisScope?.asKind(SyntaxKind.FunctionDeclaration);
                if(fnDecl?.isExported()) {
                    removeAndCheckReference(thisKeyword, propertyAccessExpression);
                    return repeat.CONTINUE;
                }
            }
            let exportsIdentifier = propertyAccessExpression.getExpression().asKind(SyntaxKind.Identifier);
            if(exportsIdentifier?.getText() === 'exports') {
                const defns = exportsIdentifier.getDefinitionNodes();
                if(defns.length === 0) {
                    // no definitions; we can safely assume this refers to top-level exports object
                    removeAndCheckReference(exportsIdentifier, propertyAccessExpression);
                    return repeat.CONTINUE;
                } else {
                    console.dir(defns.map(d => d.getFullText()));
                }
            }
        }
    }) || repeat.BREAK);
    return sourceFile.getFullText();

    function removeAndCheckReference(leftNodeToRemove: Node, propAccessExpression: PropertyAccessExpression) {
        const removeStart = leftNodeToRemove.getStart();
        const removeEnd = propAccessExpression.getNameNode().getFullStart();
        const removedSpan = sourceFile.getFullText().slice(removeStart, removeEnd);

        // Create an error message before removing nodes, in case we need to throw it below
        const preamble = `After removing ${ JSON.stringify(removedSpan) } prefix from ${ JSON.stringify(propAccessExpression.getName()) }`;

        sourceFile.removeText(removeStart, removeEnd);
        const newExpr = sourceFile.getDescendantAtPos(removeStart);

        const defns = newExpr?.asKind(SyntaxKind.Identifier)?.getDefinitionNodes();

        const defnText = defns?.[0]?.getParent()?.getFullText().trim();
        const errorMessage = `${ preamble }, identifier does not refer to a local export like expected, meaning this change would alter the code's semantics.  ${ defnText ? `Instead it refers to:\n${ defnText }\n` : `Instead, we cannot find its declaration.` }`;

        assert(defns?.length === 1, errorMessage);
        const defn = defns[0];
        assert(defn.asKind(SyntaxKind.FunctionDeclaration), errorMessage);
        assert(defn.asKind(SyntaxKind.FunctionDeclaration)?.isExported(), errorMessage);

    }
});

// TODO after removing `this.` or `exports.`, double-check that the resulting identifier expression refers to the export and not to something else.
