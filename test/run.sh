#!/usr/bin/env bash
set -euxo pipefail
shopt -s inherit_errexit

__dirname="$(CDPATH= cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$__dirname/.."

input=test/input
output=test/output
temp=test/temp

[ -e $temp ] && rm -r $temp
mkdir -p $temp
cp -r $input/* $temp

transformers=(
    dos2unix
    tabs-to-spaces
    type-assertions
    exported-function-declarations
    jsdoc-to-ts-annotations
)
for transformer in \
    "${transformers[@]}"
do
    printf '%s\n' $temp/* | NODE_OPTIONS='--require ts-node/register' jscodeshift --no-babel -t "./src/transforms/$transformer.ts" --stdin
done

diff $temp $output
