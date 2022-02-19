import { readFileSync } from 'fs';
import * as t from 'typanion';
import stripJsonComments from 'strip-json-comments';
import { findUpSync } from 'find-up';
import { dirname } from 'path';

export type Config = t.InferType<typeof configSpec> & {
    configDirname: string;
};
export const configSpec = t.isObject({
    include: t.isArray(t.isString()),
    exclude: t.isOptional(t.isArray(t.isString())),
    transforms: t.isArray(t.isString()),
    rootDir: t.isOptional(t.isString()),
    outDir: t.isOptional(t.isString()),
    filesList: t.isString()
});

export function findAndReadConfig(searchStart: string = process.cwd()) {
    const configFilePath = findUpSync('js-to-ts.config.json', {
        cwd: searchStart
    });
    return readConfig(configFilePath!);
}
export function readConfig(path: string): Config {
    const contents = readFileSync(path, 'utf8');
    const errors: string[] = [];
    const parsed: Config = JSON.parse(stripJsonComments(contents));
    if(configSpec(parsed, {errors})) {
        return {
            ...parsed,
            configDirname: dirname(path)
        }
    }
    throw new Error(`Configuration file validation failed:\n${ errors.join('\n') }`);
}
