import {Builtins, Cli, Command, Usage} from 'clipanion';
import { readConfig } from './config';

class GenerateFilesList extends Command {
    static paths = [['generate-files-list']];
    static usage: Usage = {
        description: 'generate the list of files to be modded based on config file globs'
    }
    async execute() {
        const config = readConfig('js-to-ts.config.json');
    }
}
class RunMods extends Command {
    static paths = [Command.Default];
    static usage: Usage = {
        description: 'run codemods against the generated list of files'
    };
    async execute() {

    }
}

const cli = new Cli();
cli.register(RunMods);
cli.register(GenerateFilesList);
cli.register(Builtins.HelpCommand);
cli.runExit(process.argv.slice(2), Cli.defaultContext);
