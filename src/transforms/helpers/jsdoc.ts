import {JSDocParameterTag, JSDocReturnTag, JSDocTemplateTag, SyntaxKind, ts, TypeParameterDeclarationStructure, SourceFile} from 'ts-morph';
import type * as _ts from 'typescript';
import {replace, sortBy} from 'lodash';

export interface Operation {
    start: number;
    doIt(): boolean;
}

export function createJsDocHelpers(sourceFile: SourceFile) {
    return {applyOperations, removeJsDoc, removeJsDocTag};

    function applyOperations(operations: Operation[]) {
        return sortBy(operations, o => -o.start).reduce((a, o) => {
            return o.doIt() || a;
        }, false);
    }
    // TODO refactor to accept ts-morph wrappers
    function removeJsDocTag(jsDoc: _ts.JSDoc, tag: _ts.JSDocTag, keepComment: boolean) {
        let start = tag.getStart();
        let end = tag.getEnd();
        const hasCommentToKeep = keepComment && tag.comment;
        let replacement = keepComment && tag.comment as string || '';
        const paramTag = tag as _ts.JSDocParameterTag;
        if(tag.kind === ts.SyntaxKind.JSDocTemplateTag && hasCommentToKeep) {
            const templateTag = tag as _ts.JSDocTemplateTag;
            // if also has a comment, the only thing we can remove is the constraint
            start = templateTag.constraint?.getStart() ?? start;
            end = templateTag.constraint?.getEnd() ?? start;
            replacement = '';
        }
        if((tag.kind === ts.SyntaxKind.JSDocParameterTag || tag.kind === ts.SyntaxKind.JSDocReturnTag) && hasCommentToKeep) {
            const paramTag = tag as _ts.JSDocParameterTag;
            // if also has a comment, the only thing we can remove is the constraint
            start = paramTag.typeExpression?.getStart()! ?? start;
            end = paramTag.typeExpression?.getEnd()! ?? start;
            replacement = '';
        }
        function doIt() {
            if(start !== end || replacement) {
                sourceFile.replaceText([start, end], replacement);
                return true;
            }
            return false;
        }
        return {doIt, start, end, replacement};
    }
    function removeJsDoc(jsDoc: _ts.JSDoc, attachedTo: _ts.Node, replacement: string = '') {
        const start = jsDoc.getStart();
        const end = attachedTo.getStart();
        function doIt() {
            sourceFile.replaceText([start, end], replacement);
            return true;
        }
        return {doIt, start, end};
    }
}
