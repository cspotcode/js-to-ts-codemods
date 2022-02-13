#!/usr/bin/env ts-node

import glob from 'glob';
import fs from 'fs';
import Path from 'path';
import minimatch from 'minimatch';

const files = glob
    .sync('../../{src/,types/}**/*.{js,ts,tsx}', {cwd: __dirname})
    .filter(v => !(
        // various exclusions which can be enabled/disabled based on which subset of
        // the codebase you want to transform

        // exclude node_modules 
        minimatch(v, '../../src/node_modules/**') ||
        // exclude ./types
        minimatch(v, '../../types/**')
    ));

fs.writeFileSync(Path.join(__dirname, 'source-files.txt'), files.map(f => `${ f }\n`).join(''));
