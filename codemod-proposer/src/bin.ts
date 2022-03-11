interface Config {
    cloneFromRemote: string;
    cloneRef: string;
    pushToRemote: string;
    prePatch: {
        cherryPickRemote?: string;
        cherryPickRange?: string;
        // patchFile?: string;
    };
    postPatch: {
        cherryPickRemote?: string;
        cherryPickRange?: string;
        // patchFile?: string;
        // NOTE post-patch is filtered to only apply to the modded files.
    };
    include: string[];
    exclude: string[];
    transforms: string[];
}

/*
 * Note: mods should execute against the full codebase, because it is needed for typechecking.
 * Only modified files should be copied into the refs below.
 */

/*
 * Output should look like this:
 * /refs/js-to-ts-codemods/proposal/<cloneFromRemote commit hash>/summary               Single markdown file with links to everything else.
 * /refs/js-to-ts-codemods/proposal/<cloneFromRemote commit hash>/unmodified            Unmodified source files, copied into an empty branch.
 * /refs/js-to-ts-codemods/proposal/<cloneFromRemote commit hash>/pre-patched           Results of cherry-picking the pre-patch.
 * /refs/js-to-ts-codemods/proposal/<cloneFromRemote commit hash>/renamed               Unmodified source files, renamed to provide a good base for diffing.
 * /refs/js-to-ts-codemods/proposal/<cloneFromRemote commit hash>/mod1/<name of mod>    Results of applying the first mod.
 * /refs/js-to-ts-codemods/proposal/<cloneFromRemote commit hash>/mod2/<name of mod>    Results of applying the second mod.
 * /refs/js-to-ts-codemods/proposal/<cloneFromRemote commit hash>/mod3/<name of mod>    
 * /refs/js-to-ts-codemods/proposal/<cloneFromRemote commit hash>/final                 Results of cherry-picking the post-patch.  This is the final result.
 */

/*
Summary report

## Results

Starting from ${cloneFromRemote} commit ${} (refs/heads/master) <-- render as link

### Applied automated modding to the following files:

```

```

### Cherry-picked the following to prepare the code for modding:
< Link to cherry-picked range on GH >
- [Browse](<Link to proposal tree>) [Diff](< Link to proposal diff >)
- [Browse canonical representation](<Link to proposal tree>) [Diff](< Link to proposal diff >)

### Renamed all .js to .ts
- [Browse]() [Diff of this step]() [Diff of all steps]()
- [Browse canonical representation]() [Diff of this step](< Link to proposal diff >) [Diff of all steps]()

### Applied the following transformations:

* <name of transformation>
- Code: [Browse]() [Diff of this step]() [Diff of all steps]()
- Canonical form: [Browse]() [Diff of this step]() [Diff of all steps]()

### Cherry-picked the following to fixup the code after modding:
< Link to cherry-picked range on GH >

- Code: [Browse]() [Diff of this step]() [Diff of all steps]()
- Canonical form: [Browse]() [Diff of this step]() [Diff of all steps]()
*/
