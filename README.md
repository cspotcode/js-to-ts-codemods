jscodeshift codemods to convert JS -> TS, JSDoc annotations into TS annotations.

See also, projects in the same space but which don't handle JSDoc -> TS

- ts-migrate
- typestat
  - does not convert JSDoc to TypeScript annotations
- TypeScript's built-in quick-fixes which can generate TS annotations from JSDoc but
  - does not delete the JSDoc
  - missing support for `@template {Constraint}`s, maybe other things

<!--
Link dump

https://github.com/rajasegar/awesome-codemods

-->
