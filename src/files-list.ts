#!/usr/bin/env ts-node

import glob from 'glob';
import fs, { readFileSync } from 'fs';
import Path, { resolve } from 'path';
import minimatch from 'minimatch';
import { CliConfig, Config } from './config';
import lodash from 'lodash';
const {flatten} = lodash;

export function createFilesListFromGlobs(cliConfig: CliConfig) {
    const files = flatten(cliConfig.config.include.map(pattern => {
        return glob.sync(pattern, {cwd: cliConfig.configDirname});
    }));
    const filesFiltered = files.filter(v =>
        !cliConfig.config.exclude?.some(pattern => minimatch(v, pattern))
    );
    return filesFiltered;
}

export function readFilesList(cliConfig: CliConfig) {
    if(cliConfig.config.filesList) {
        const files = readFileSync(resolve(cliConfig.configDirname, cliConfig.config.filesList), 'utf8').split('\n').filter(v => v);
        return files;
    } else {
        const files = createFilesListFromGlobs(cliConfig);
        return files;
    }
}
