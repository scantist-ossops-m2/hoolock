# hoolock

Suite of 43 lightweight utilities designed to maintain a small footprint when bundled, without compromising on ease of integration and use. Heavily inspired by [lodash](https://lodash.com/), I created hoolock to meet my own needs and preferences, which are primarily concerned with size.

## Features

<dl>
<dt>

**Tree-Shakable** :white_check_mark:

</dt>
<dd>

The main entry point exports all utilities as named exports; however, is designed to be tree-shakable by most modern bundlers.
As of version `2.0.0`, each release has tree-shakability tested in [rollup](https://rollupjs.org/guide/en/) and [esbuild](https://esbuild.github.io/)
(on minimal or default tree-shaking settings).

Individual imports should not be necessary in most environments. Despite this, hoolock maintains a modular design,
with a unique entry point for each of the 43 utilities.

</dd>
<dt>

**Built-ins Preferred** :white_check_mark:

</dt>
<dd>

JavaScript's built-in functions, such as `Array.prototype.map`, `Array.prototype.forEach` and `Object.keys`, are prioritized to minimize size and improve performance.
Utilities with built-in 'equivalents' are typically extensions. For example, `join` accepts a distinct, final delimiter; however, still leverages `Array.prototype.join` internally.

</dd>
<dt>

**CJS & ESM Support** :white_check_mark:

</dt>
<dd>

Despite its compact size, hoolock contains builds for both CommonJS (CJS) and ECMAScript Modules (ESM).

</dd>
<dt>

**React Compatible** :white_check_mark:

</dt>
<dd>

Several utilities were built with React integrations in mind. For example, `clone`, `cloneDeep` and `merge` will ignore/preserve React elements.
Additionally, many utilities (e.g. `merge`) are immutable, following React's state management principles.

</dd>
</dl>
