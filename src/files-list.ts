#!/usr/bin/env ts-node

import glob from 'glob';
import fs, { readFileSync } from 'fs';
import Path, { resolve } from 'path';
import minimatch from 'minimatch';
import { Config } from './config';
import lodash from 'lodash';
const {flatten} = lodash;

export function createFilesListFromGlobs(config: Config) {
    const files = flatten(config.include.map(pattern => {
        return glob.sync(pattern, {cwd: config.configDirname});
    }));
    const filesFiltered = files.filter(v =>
        !config.exclude?.some(pattern => minimatch(v, pattern))
    );
    return filesFiltered;
}

export function readFilesList(config: Config) {
    if(config.filesList) {
        const files = readFileSync(resolve(config.configDirname, config.filesList), 'utf8').split('\n').filter(v => v);
        return files;
    } else {
        const files = createFilesListFromGlobs(config);
        return files;
    }
}
