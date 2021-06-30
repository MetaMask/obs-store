# ObservableStore

`ObservableStore` is a synchronous in-memory store for a single value,
that you can subscribe to updates for.

Previously known as `obs-store`.

## Usage

```js
import { ObservableStore } from '@metamask/obs-store';

const store = new ObservableStore(initState);
store.subscribe(function showValue(value) {
  console.log('saw value:', value);
});

store.putState(5); // "saw value: 5"
store.putState(true); // "saw value: true"
store.putState({ hello: 'world' }); // "saw value: { hello: 'world' }"

console.log(store.getState().hello); // "world"
```

## Streams

Each `ObservableStore` can be turned into an `ObservableStoreStream`.
An `ObservableStoreStream` is a duplex stream that you can pipe new values into or pipe updated values out of.

Special behavior: Doesn't buffer outgoing updates, writes latest state to destination on pipe.

```js
import { ObservableStore, storeAsStream } from '@metamask/obs-store';
import pump from 'pump';

const storeOne = new ObservableStore(initState);
const storeTwo = new ObservableStore();

pump(storeAsStream(storeOne), transformStream, storeAsStream(storeTwo));
```

## Contributing

### Setup

- Install [Node.js](https://nodejs.org) version 12
  - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
- Install [Yarn v1](https://yarnpkg.com/en/docs/install)
- Run `yarn setup` to install dependencies and run any requried post-install scripts
  - **Warning:** Do not use the `yarn` / `yarn install` command directly. Use `yarn setup` instead. The normal install command will skip required post-install scripts, leaving your development environment in an invalid state.

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.
