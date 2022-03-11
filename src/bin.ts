#!/usr/bin/env -S ts-node-esm
//#!/usr/bin/env -S node --require ./src/suppress-warning.js --loader ts-node/esm --experimental-specifier-resolution=node

import {Builtins, Cli, Command, Usage, ErrorWithMeta} from 'clipanion';
import {} from 'jscodeshift';
import { copyFileSync, fstat, writeFileSync } from 'fs';
import { relative, resolve } from 'path';
import { findAndReadConfig } from './config.js';
import { createFilesListFromGlobs, readFilesList } from './files-list.js';
import {$} from '@cspotcode/zx';
import { runMods } from './api.js';

class GenerateFilesList extends Command {
    static paths = [['generate-files-list']];
    static usage: Usage = {
        description: 'generate the list of files to be modded based on config file globs, and write to disk'
    }
    async execute() {
        const cliConfig = findAndReadConfig();
        const filesList = createFilesListFromGlobs(cliConfig);
        writeFileSync(resolve(cliConfig.configDirname, cliConfig.config.filesList!), filesList.map(f => `${ f }\n`).join(''));
    }
}
class RunMods extends Command {
    static paths = [['run']];
    static usage: Usage = {
        description: 'run codemods against the generated list of files'
    };
    async execute() {
        const cliConfig = findAndReadConfig();
        const filesList = readFilesList(cliConfig);
        await runMods(cliConfig.config, filesList);
    }
}

class GenerateProposal extends Command {
    static paths = [['create-proposal']];
    static usage: Usage = {
        description: 'Create a proposal pull request, plus full diff reporting'
    };
    async execute() {
        const cliConfig = findAndReadConfig();
        const filesList = readFilesList(cliConfig);
        await runMods(cliConfig.config, filesList);
    }
}


const cli = new Cli();
cli.register(RunMods);
cli.register(GenerateFilesList);
cli.register(GenerateProposal);
cli.register(Builtins.HelpCommand);
cli.runExit(process.argv.slice(2), Cli.defaultContext);
