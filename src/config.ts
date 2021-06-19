import { readFileSync } from 'fs';
import * as t from 'typanion';

export type Config = t.InferType<typeof configSpec>;
export const configSpec = t.isObject({
    include: t.isArray(t.isString()),
    exclude: t.isOptional(t.isArray(t.isString())),
});

export function readConfig(path: string) {
    const contents = readFileSync(path, 'utf8');
    const errors: string[] = [];
    const parsed = JSON.parse(contents);
    if(configSpec(parsed, {errors})) {
        return parsed;
    }
    throw new Error(`Configuration file validation failed:\n${ errors.join('\n') }`);
}
