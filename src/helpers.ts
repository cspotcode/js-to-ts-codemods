import { Options, API, FileInfo, Program } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';
import { parse as recastTypescriptParse } from 'recast/parsers/typescript';

export const parser = {
    parse: recastTypescriptParse
};

export type OurTransformer = (args: OurTransformerArgs) => string | void;
export interface OurTransformerArgs {
    /** Same fileInfo object coming from jscodeshift */
    fileInfo: FileInfo,
    /** same api object coming from jscodeshift */
    api: API,
    j: API['j'],
    /** same options object coming from jscodeshift */
    options: Options;
    /** relevant for preserving comments on the first node; handled automatically and can usually be ignored */
    firstNode: any;
    /** relevant for preserving comments on the first node; handled automatically and can usually be ignored */
    firstNodeComments: any;
    /** Jscodeshift Collection<> wrapper around root AST node */
    $root: Collection<any>;
    /** root AST node */
    root: Program;
}

export function wrapTransformer(transformer: OurTransformer) {
    // transformation.parser = 'tsx';
    return transformation;

    function transformation(fileInfo: FileInfo, api: API, options: Options) {
        const j = api.jscodeshift;
        const $root = j(fileInfo.source);

        // Keep comments when the first node is replaced: https://github.com/facebook/jscodeshift/blob/master/recipes/retain-first-comment.md
        const getFirstNode = () => $root.find(j.Program).get('body', 0).node;
        // Save the comments attached to the first node
        const firstNode = getFirstNode();
        const { comments: firstNodeComments } = firstNode;

        const root = $root.find(j.Program).nodes()[0] as Program;

        const returnedOutput = transformer({
            api,
            fileInfo,
            firstNode,
            firstNodeComments,
            options,
            $root,
            root,
            j: api.j
        });

        if(typeof returnedOutput === 'string') {
            return returnedOutput;
        }

        // If transformer did not return a string, it mutated the `root` AST and it
        // wants us to stringify that.

        // If the first node has been modified or deleted, reattach the comments
        const firstNode2 = getFirstNode();
        if(firstNode2 !== firstNode) {
            firstNode2.comments = firstNodeComments;
        }

        return $root.toSource();
    }
}
