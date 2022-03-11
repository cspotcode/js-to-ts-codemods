#!/usr/bin/env ts-node-esm
import assert from 'assert';
import lodash from 'lodash';
const {matches} = lodash;
import fs from 'fs-extra';
const {writeJsonSync, writeFileSync} = fs;
import { dirname, resolve } from 'path';
import * as TJS from 'typescript-json-schema';
import Ajv from 'ajv';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const program = TJS.programFromConfig(resolve(__dirname, '../tsconfig.json'));
const generator = TJS.buildGenerator(program, {
    ignoreErrors: true,
    uniqueNames: true,
    required: true,
    noExtraProps: false,
});
const fullyQualifiedName = `${JSON.stringify(resolve(__dirname, '../src/config'))}.Config`;
const symbol = generator?.getSymbols().find(matches({fullyQualifiedName}));
const schema = generator?.getSchemaForSymbol(symbol!.name);
writeJsonSync(resolve(__dirname, '../config.schema.json'), schema, {spaces: 2});

const compiledValidator = new Ajv({
    code: {
        source: true,
        lines: true,
        esm: true
    }
}).compile(schema!);
writeFileSync(resolve(__dirname, '../src/configSchemaValidator.js'), `
    export {${ compiledValidator.source!.validateName } as validate};
    ${ compiledValidator.source!.validateCode }
`);
