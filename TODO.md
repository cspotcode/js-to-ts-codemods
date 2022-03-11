## TODO

Where I'm at:

jsdoc-to-ts-annotations.ts
Working on the conversion of JSDoc on functions
- [x] extract @template into <>
- [x] remove @template tag
- [x] extract @param {type}
- if param tag has description
  - [x] strip @param {type} from param tag
- else
  - [x] remove entire @param tag
- [x] extract @return {type}
- if return tag has description
  - [x] strip {type} from it
- else
  - [x] remove entire tag
- [x] remove entire jsdoc if it doesn't have anything after our processing
- [x] rewrite @typedef into `type Foo = ` or `interface Foo `
  - [x] rewrite into `interface` when possible?
- [x] rewrite `import()` types to refer to an `import` statement
- [ ] rewrite `var` to `let` or `const`
  - I already wrote this codemod; find my old code in brain branch
- [x] rewrite `require()` into `import`
  - I already wrote this?  Check old brain branch
  - https://github.com/5to6/5to6-codemod
- [x] rewrite `this.foo` in exported functions to `foo`, assuming `foo` is a peer export
- [x] rewrite `exports.foo` into `foo`, assuming `foo` is a peer export
- [ ] extract leading indent detection logic into helper functions

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
