import { ErrorWithMeta } from 'clipanion';
import { readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';
import { findUpSync } from 'find-up';
import { dirname } from 'path';
import { validate as validateConfig } from './configSchemaValidator.js';

export interface Config {
    /** Globs of files to transform */
    include: Array<string>;
    /** Exclude files matching these globs from transformation */
    exclude?: Array<string>;
    /** Run these codemod transformations in this order */
    transforms?: Array<string>;
    /** If paired with outDir, maps files from an input to an output directory */
    rootDir?: string;
    /** see rootDir */
    outDir?: string;
    /** if specified, path to a text file listing all files to transform, one path per line */
    filesList?: string;
    /** when creating a codemod proposal, clones code from this repo */
    cloneFrom?: {
        remote: string;
        ref: string;
    };
    /** when creating a codemod proposal, pushes reports to this repo */
    pushTo?: {
        remote?: string;
        refPrefix?: string;
        /** Template with {{revisionA}} and {{revisionB}} */
        diffViewerTemplate?: string;
        /** Template with {{revision}} */
        treeBrowserTemplate?: string;
    };

    prePatch?: null | {
        cherryPick: {
            remote?: string;
            range: string;
        }
    };
    postPatch?: null | {
        cherryPick: {
            remote: string;
            range: string;
        }
    };
}
export interface CliConfig {
    config: InternalConfig;
    configDirname: string;
}

export function findAndReadConfig(searchStart: string = process.cwd()) {
    const configFilePath = findUpSync('js-to-ts.config.json', {
        cwd: searchStart
    });
    return readConfig(configFilePath!);
}
export function readConfig(path: string): CliConfig {
    const contents = readFileSync(path, 'utf8');
    const errors: string[] = [];
    const config: Config = JSON.parse(stripJsonComments(contents, {whitespace: true}));
    if(!validateConfig(config)) {
        throw Object.assign(new Error(`Configuration file validation failed:\n${ validateConfig.errors!.map(e => `${ e.instancePath ? `${ e.instancePath } ` : `` }${ e.message }`).join('\n') }`), {
            clipanion: {type: 'none'}
        } as ErrorWithMeta);
    }
    const configDirname = dirname(path);
    const configWithDefaults = setDefaultsOnConfig(config, configDirname);
    return {
        config: configWithDefaults,
        configDirname
    };
}

type InternalConfig = ReturnType<typeof setDefaultsOnConfig>;
function setDefaultsOnConfig(config: Config, configDirname: string) {
    const {include, cloneFrom, exclude, filesList, outDir, postPatch, prePatch, pushTo, rootDir, transforms} = config;
    return {
        include,
        exclude: exclude ?? [],
        filesList,
        rootDir: rootDir ?? configDirname,
        outDir: outDir ?? rootDir ?? configDirname,
        cloneFrom,
        prePatch,
        transforms: transforms ?? [],
        postPatch,
        pushTo,
    };
}
