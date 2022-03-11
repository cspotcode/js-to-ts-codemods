/// <reference types="ts-expose-internals" />

// check for any possible expression or identifier with
// an @type comment on it
// wrapped in parentheses (parens will be outside of the expression's span)

// Check that comment is *only* @type and has nothing else
// Wrap type in parens.  Wrap expression in parens
// wrap both in type assertion node

import { ASTPath, conditionalExpression, exportDeclaration, FunctionDeclaration, Statement, typeParameter } from 'jscodeshift';
import {SyntaxKind} from 'ts-morph';
import type * as _ts from 'typescript';
import { parser, repeat, wrapTransformer } from '../helpers';
export {parser};

export default wrapTransformer(function({j, $root}) {
    const topLevelFunctions = new Map<string, ASTPath<FunctionDeclaration>>();
    for(const $fnDecl of $root.find(j.FunctionDeclaration).paths()) {
        if($fnDecl.parent.node.type === 'Program') {
            topLevelFunctions.set($fnDecl.node.id?.name!, $fnDecl);
        }
    }
    const $program = $root.find(j.Program);
    const program = $program.nodes()[0];
    for(const $statement of $program.find(j.ExpressionStatement).filter(n => n.parentPath.node === program).paths()) {
        if(j.ExpressionStatement.check($statement.node) && j.AssignmentExpression.check($statement.node.expression)) {
            const {left, right} = $statement.node.expression;
            if(
                j.MemberExpression.check(left) &&
                j.Identifier.check(left.object) &&
                j.Identifier.check(left.property) &&
                left.object.name === 'exports'
            ) {
                if(j.FunctionExpression.check(right)) {
                    const name = left.property.name;
                    if(right.id == undefined || right.id.name === name) {
                        const replacement = j.exportNamedDeclaration(
                            j.functionDeclaration.from({
                                id: left.property, params: right.params, body: right.body,
                                typeParameters: right.typeParameters
                            })
                        );
                        replacement.comments = $statement.node.comments;
                        $statement.replace(replacement);
                    } else {
                        $statement.insertBefore(j.exportNamedDeclaration(
                            null, [j.exportSpecifier.from({
                                local: right.id,
                                exported: left.property
                            })]
                        ));
                        const fnDecl = j.functionDeclaration.from({
                            id: right.id, params: right.params, body: right.body, typeParameters: right.typeParameters
                        });
                        fnDecl.comments = $statement.node.comments;
                        $statement.replace(fnDecl);
                    }
                } else if(j.Identifier.check(right)) {
                    // maybe `exports.foo = bar`?
                    const fnDeclaration = topLevelFunctions.get(right.name);
                    if(fnDeclaration) {
                        const exportDeclaration = j.exportNamedDeclaration(fnDeclaration.node);
                        exportDeclaration.comments = fnDeclaration.node.comments;
                        fnDeclaration.node.comments = [];
                        fnDeclaration.replace(exportDeclaration);
                        $statement.replace();
                    }
                }
            }
        }
    }
});
