## TODO

Where I'm at:

jsdoc-to-ts-annotations.ts
Working on the conversion of JSDoc on functions
- extract @template into <>
- remove @template tag
- extract @param {type}
- if param tag has description
  - strip @param {type} from param tag
- else
  - remove entire @param tag
- extract @return {type}
- if return tag has description
  - strip {type} from it
- else
  - remove entire tag
- remove entire jsdoc if it doesn't have anything after our processing

- support a pre-patch and post-patch
  - patch the codebase before/after codemods.  Useful to augment automated modding with
    manual fixes without necessarily committing them right away.

## Use-case

Specify glob of files to be ported
Find files not touched by recent pull requests
- PRs with most recent X IDs
- with HEAD commit dated in last X days
- excluding known problematic PRs by ID (for example the PR that this tool is likely to create)

Tool ports those files (find the tool that I wrote for this; I have it somewhere)
Prepares a branch with the ported files
Runs lint verification; reports failures
For every commit to eternal branches and pull requests
- run a TS->CommonJS transform at `refs/heads/<commit hash>/canonical-cjs`
- run a TS->ESM transform at `refs/heads/<commit hash>/canonical-esm`
- run codemods `refs/heads/<commit hash>/codemod/1`
- run codemods `refs/heads/<commit hash>/codemod/2`
- ...
- run codemods `refs/heads/<commit hash>/codemod/all`
