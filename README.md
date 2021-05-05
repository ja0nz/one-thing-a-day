# TypeScript Boilerplate for 2021

[![Build and test status](https://github.com/metachris/typescript-boilerplate/workflows/Lint%20and%20test/badge.svg)](https://github.com/metachris/micropython-ctl/actions?query=workflow%3A%22Build+and+test%22)

TypeScript project boilerplate with modern tooling, for Node.js programs, libraries and browser modules. Get started quickly and right-footed 🚀

* [TypeScript 4](https://www.typescriptlang.org/)
* Optionally [esbuild](https://esbuild.github.io/) to bundle for browsers (and Node.js)
* Linting with [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) ([tslint](https://palantir.github.io/tslint/) is deprecated)
* Testing with [uvu](https://github.com/lukeed/uvu/)
* Publishing to npm
* Continuous integration ([GitHub Actions](https://docs.github.com/en/actions) / [GitLab CI](https://docs.gitlab.com/ee/ci/))
* Automatic API documentation with [TypeDoc](https://typedoc.org/guides/doccomments/)

See also the introduction blog post: **[Starting a TypeScript Project in 2021](https://www.metachris.com/2021/03/bootstrapping-a-typescript-node.js-project/)**.


## Getting Started

```bash
# Clone the repository (you can also click "Use this template")
git clone https://github.com/metachris/typescript-boilerplate.git your_project_name
cd your_project_name

# Edit `package.json` and `tsconfig.json` to your liking
...

# Install dependencies
pnpm install

# Now you can run various pnpm commands:
pnpm cli
pnpm lint
pnpm test
pnpm build-all
pnpm ts-node <filename>
pnpm esbuild-browser
...
```

* Take a look at all the scripts in [`package.json`](https://github.com/metachris/typescript-boilerplate/blob/master/package.json)
* For publishing to npm, use `pnpm publish` (or `npm publish`)

## esbuild

[esbuild](https://esbuild.github.io/) is an extremely fast bundler that supports a [large part of the TypeScript syntax](https://esbuild.github.io/content-types/#typescript). This project uses it to bundle for browsers (and Node.js if you want).

```bash
# Build for browsers
pnpm esbuild-browser:dev
pnpm esbuild-browser:watch

# Build the cli for node
pnpm esbuild-node:dev
pnpm esbuild-node:watch
```

You can generate a full clean build with `pnpm build-all` (which uses both `tsc` and `esbuild`).

* `package.json` includes `scripts` for various esbuild commands: [see here](https://github.com/metachris/typescript-boilerplate/blob/master/package.json#L23)
* `esbuild` has a `--global-name=xyz` flag, to store the exports from the entry point in a global variable. See also the [esbuild "Global name" docs](https://esbuild.github.io/api/#global-name).
* Read more about the esbuild setup [here](https://www.metachris.com/2021/04/starting-a-typescript-project-in-2021/#esbuild).
* esbuild for the browser uses the IIFE (immediately-invoked function expression) format, which executes the bundled code on load (see also https://github.com/evanw/esbuild/issues/29)


## Tests with Uvu

You can write [Uvu tests](https://github.com/lukeed/uvu/#usage):

```typescript
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { greet } from './main'

test('the data is peanut butter', () => {
  assert.is(1, 1);
});

test('greeting', () => {
  assert.is(greet('Foo'), 'Hello Foo');
});

test.run();
```

Run the tests with `pnpm test`, no separate compile step is necessary.

* See also the (optinal) [Uvu/assert collection ](https://github.com/lukeed/uvu/blob/master/docs/api.assert.md). Because uvu operates through thrown Errors (or lack thereof), any Error-based utility can be used as an assertion.

* The tests can be automatically run in CI (GitHub Actions, GitLab CI): [`.github/workflows/lint-and-test.yml`](https://github.com/metachris/typescript-boilerplate/blob/master/.github/workflows/lint-and-test.yml), [`.gitlab-ci.yml`](https://github.com/metachris/typescript-boilerplate/blob/master/.gitlab-ci.yml)

## Documentation, published with CI

You can auto-generate API documentation from the TyoeScript source files using [TypeDoc](https://typedoc.org/guides/doccomments/). The generated documentation can be published to GitHub / GitLab pages through the CI.

Generate the documentation, using `src/main.ts` as entrypoint (configured in package.json):

```bash
pnpm docs
```

The resulting HTML is saved in `docs/`.

You can publish the documentation through CI:
* [GitHub pages](https://pages.github.com/): See [`.github/workflows/deploy-gh-pages.yml`](https://github.com/metachris/typescript-boilerplate/blob/master/.github/workflows/deploy-gh-pages.yml)
* [GitLab pages](https://docs.gitlab.com/ee/user/project/pages/): [`.gitlab-ci.yml`](https://github.com/metachris/typescript-boilerplate/blob/master/.gitlab-ci.yml)

This is the documentation for this boilerplate project: https://metachris.github.io/typescript-boilerplate/

## References

* **[Blog post: Starting a TypeScript Project in 2021](https://www.metachris.com/2021/03/bootstrapping-a-typescript-node.js-project/)**
* [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
* [tsconfig docs](https://www.typescriptlang.org/tsconfig)
* [esbuild docs](https://esbuild.github.io/)
* [typescript-eslint docs](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md)
* [Jest docs](https://jestjs.io/docs/getting-started)
* [GitHub Actions](https://docs.github.com/en/actions), [GitLab CI](https://docs.gitlab.com/ee/ci/)


## Feedback

Reach out with feedback and ideas:

* [twitter.com/metachris](https://twitter.com/metachris)
* [Create a new issue](https://github.com/metachris/typescript-boilerplate/issues)
