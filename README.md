# Demo

This project was generated using [Nx](https://nx.dev).

## Development requirements

The workspace uses Nx 24.0.6, Angular 22.3.0, and NgRx 22.0.1.

Use Node.js 22.22.3 or newer in the Node 22 release line, Node 24.15.0 or newer in the Node 24 release line, or Node 26+. The `.nvmrc` file pins Node 26.13.1, the version used to validate this workspace. Select that version with your Node version manager, then run `npm ci`.

Angular 22 requires TypeScript 6. Keep the compiler within the supported `>=6.0 <6.1` range when updating dependencies.

Nx 24.0.6 imports an Angular Architect subpath that Angular 22.3 no longer exports. `npm ci` applies the versioned patch in `patches/nx+24.0.6.patch` to use the public `@angular-devkit/architect/node` entry point. Remove the patch when an Nx release includes this fix.

The demo builds and serves with `@angular/build`. Cypress end-to-end tests use Vite to resolve the workspace's TypeScript aliases.

Cypress component tests use the workspace's `@cypress/webpack-dev-server` adapter because the adapter bundled with Cypress does not support Angular 22's webpack-dev-server 6. The Nx component testing preset still supplies the project build configuration.

Components use Angular 22's default OnPush change detection. Custom form controls and overlays notify Angular when programmatic updates affect their views. TypeScript configurations use supported module resolution. Jest uses CommonJS configs to avoid the legacy TypeScript config loader. Jest, ESLint, and Cypress targets are inferred by the plugins registered in `nx.json`.

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Extensible Build Framework**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nx/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nx/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `ng g @nx/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nx/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@demo/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `npm run e2e:demo:local` or `npm run e2e:demo:watch` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
