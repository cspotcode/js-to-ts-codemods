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

// TODO use this prettier plugin?
// https://github.com/hosseinmd/prettier-plugin-jsdoc

export default wrapTransformer(function({sourceFile}) {
    const {applyOperations, removeJsDoc, removeJsDocTag} = createJsDocHelpers(sourceFile);
    repeat(() => sourceFile.forEachDescendant((node, traversal) => {
        const jsDocs = (node as any).compilerNode.jsDoc as undefined | Array<_ts.JSDoc>;
        for(const jsDoc of jsDocs ?? []) {
            const original = jsDoc.getFullText();
            let leadingIndentStarts = jsDoc.getFullStart() - 1;
            const fullText = sourceFile.getFullText();
            for(; fullText[leadingIndentStarts] === ' '; leadingIndentStarts--) {}
            if(fullText[leadingIndentStarts] === '\n') {
                leadingIndentStarts++;
            } else {
                leadingIndentStarts = jsDoc.getFullStart();
            }
            const leadingIndent = fullText.slice(leadingIndentStarts, jsDoc.getFullStart());
            // TODO move empty JSDoc stripping into here, out of jsdoc-to-ts-annotations
            let replacement = original;
            // Moving ending `*/` to its own line
            replacement = replacement.replace(/(\n[^\n]*?[^ \n*])\*\/$/, '$1\n*/');
            // Fix indentation and leading ` * `
            replacement = replacement.replace(/\n *(?:\* )?/g, `\n${ leadingIndent } * `);
            // replace ending `* */` with `*/`
            replacement = replacement.replace(/\* \*\/$/, '*/');
            // Collapse single-line JSDoc into one line
            replacement = replacement.replace(/^\/\*\*\n *(?:\* *)?([^\n]+)\n *\*\/$/, '/** $1 */');
            // If JSDoc comment is empty, delete it
            replacement = replacement.replace(/^\/\*[ *\n]*\*\/$/, '');

            if(replacement !== original) {
                sourceFile.replaceText([jsDoc.getFullStart(), jsDoc.getEnd()], replacement);
                return repeat.CONTINUE;
            }
        }
    }) || repeat.BREAK);
    return sourceFile.getFullText();
});

