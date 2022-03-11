#!/usr/bin/env -S ts-node-esm

import {Builtins, Cli, Command, Usage} from 'clipanion';
import {} from 'jscodeshift';
import { copyFileSync, fstat, writeFileSync } from 'fs';
import { relative, resolve } from 'path';
import { Config, findAndReadConfig } from './config.js';
import { createFilesListFromGlobs, readFilesList } from './files-list.js';
import {$} from '@cspotcode/zx';

export async function runMods(config: Config, filesList: Array<string>) {
    const outPaths: string[] = [];
    for(const file of filesList) {
        // TODO make this logic accept when you do not set a rootDir and outDir
        const outPath = config.rootDir && config.outDir ? resolve(config.outDir, relative(config.rootDir, file)) : file;
        if(outPath !== file) copyFileSync(file, outPath);
        outPaths.push(outPath);
    }

    process.env.NODE_OPTIONS = '--require ts-node/register';
    for(const transform of config.transforms ?? []) {
        const jscsproc = $`jscodeshift --no-babel -t "./src/transforms/${transform}.ts"* --stdin`;
        jscsproc.stdin.write(outPaths.join('\n'));
        jscsproc.stdin.end();
        await jscsproc;
    }
}
