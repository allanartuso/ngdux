# plugin

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build plugin` to build the library.

## Running unit tests

Run `nx test plugin` to execute the unit tests via [Jest](https://jestjs.io).

## Generating a library

```sh
nx generate @ngil/lib-generator:demo-lib my-lib demo feature none --importPrefix=@my-org
```

`importPrefix` defaults to `@demo`. The example generates the import path
`@my-org/demo/feature/my-lib`. Add `--isCommon` to include `/common` after the library scope.

With `--publishable`, the import path is a package name such as `@my-org/demo-feature-my-lib`.
Choosing `vitest-angular` on Angular 21 or later also uses the package name format and creates a private buildable library by default.
