import { NodePath } from 'ast-types';
import _, { sortBy } from 'lodash';
import {DefaultClause, JSDocParameterTag, JSDocReturnTag, JSDocTemplateTag, SyntaxKind, ts, TypeParameterDeclarationStructure} from 'ts-morph';
import type * as _ts from 'typescript';
import { parser, repeat, wrapTransformer } from '../helpers';
import { createJsDocHelpers, Operation } from './helpers/jsdoc';
import transformImports from 'transform-imports';
export {parser};

export default wrapTransformer(function({fileInfo}) {
    // TODO force file to be module by prepending `export {}`; removing it afterward.

    // https://github.com/suchipi/transform-imports
    const output = transformImports(fileInfo.source, (importDefs) => {
        for(const def of importDefs) {
            def.importedExport.isImportedAsCJS = false;
        }
    }, {parser});
    return output;
});
