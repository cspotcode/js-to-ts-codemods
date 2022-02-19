#!/usr/bin/env -S ts-node-esm
//#!/usr/bin/env -S node --require ./src/suppress-warning.js --loader ts-node/esm --experimental-specifier-resolution=node

import {Builtins, Cli, Command, Usage} from 'clipanion';
import { copyFileSync, fstat, writeFileSync } from 'fs';
import { relative, resolve } from 'path';
import { findAndReadConfig } from './config.js';
import { createFilesListFromGlobs, readFilesList } from './files-list.js';
import {$} from '@cspotcode/zx';

class GenerateFilesList extends Command {
    static paths = [['generate-files-list']];
    static usage: Usage = {
        description: 'generate the list of files to be modded based on config file globs, and write to disk'
    }
    async execute() {
        const config = findAndReadConfig();
        const filesList = createFilesListFromGlobs(config);
        writeFileSync(resolve(config.configDirname, config.filesList), filesList.map(f => `${ f }\n`).join(''));
    }
}
class RunMods extends Command {
    static paths = [Command.Default, ['run']];
    static usage: Usage = {
        description: 'run codemods against the generated list of files'
    };
    async execute() {
        const config = findAndReadConfig();
        const filesList = readFilesList(config);
        const outPaths: string[] = [];
        for(const file of filesList) {
            // TODO make this logic accept when you do not set a rootDir and outDir
            const outPath = config.rootDir && config.outDir ? resolve(config.outDir, relative(config.rootDir, file)) : file;
            if(outPath !== file) copyFileSync(file, outPath);
            outPaths.push(outPath);
        }

        process.env.NODE_OPTIONS = '--require ts-node/register';
        for(const transform of config.transforms) {
            const jscsproc = $`jscodeshift --no-babel -t "./src/transforms/${transform}.ts"* --stdin`;
            jscsproc.stdin.write(outPaths.join('\n'));
            jscsproc.stdin.end();
            await jscsproc;
        }
    }
}

const cli = new Cli();
cli.register(RunMods);
cli.register(GenerateFilesList);
cli.register(Builtins.HelpCommand);
cli.runExit(process.argv.slice(2), Cli.defaultContext);
