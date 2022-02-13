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
