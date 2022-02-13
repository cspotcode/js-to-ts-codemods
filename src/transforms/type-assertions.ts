/// <reference types="ts-expose-internals" />

// check for any possible expression or identifier with
// an @type comment on it
// wrapped in parentheses (parens will be outside of the expression's span)

// Check that comment is *only* @type and has nothing else
// Wrap type in parens.  Wrap expression in parens
// wrap both in type assertion node

import {SyntaxKind} from 'ts-morph';
import type * as _ts from 'typescript';
import { parser, repeat, wrapTransformer } from '../helpers';
export {parser};

export default wrapTransformer(function({sourceFile}) {
    repeat(() => sourceFile.forEachDescendant(node => {
        if(node.getKind() === SyntaxKind.ParenthesizedExpression) {
            const {jsDoc} = node.compilerNode as _ts.ParenthesizedExpression;
            if(jsDoc?.length === 1 && jsDoc[0].tags?.length === 1 && jsDoc[0].tags[0].tagName?.text === 'type') {
                const tag = jsDoc[0].tags[0] as _ts.JSDocTypeTag;
                const replacementStart = jsDoc[0].getStart();
                const replacementEnd = node.getEnd();
                const replacementText = node.getText() + ' as ' + tag.typeExpression.type.getText();
                sourceFile.removeText(replacementStart, replacementEnd);
                sourceFile.insertText(replacementStart, replacementText);
                return repeat.CONTINUE;
            }
        }
    }) || repeat.BREAK);
    return sourceFile.getFullText();
});
