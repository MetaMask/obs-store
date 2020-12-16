# ObservableStore

`ObservableStore` is a synchronous in-memory store for a single value,
that you can subscribe to updates on.

## Usage

```js
import { ObservableStore } from 'obs-store'

const store = new ObservableStore(initState)
store.subscribe(function showValue(value) {
  console.log('saw value:', value)
})

store.putState(5) // "saw value: 5"
store.putState(true) // "saw value: true"
store.putState({ hello: 'world' }) // "saw value: { hello: 'world' }"

console.log(store.getState().hello) // "world"
```

## Streams

Each `ObservableStore` can be turned into an `ObservableStoreStream`.
An `ObservableStoreStream` is a duplex stream that you can pipe new values into it or
pipe its updated values out of it.

Special behavior: Doesnt buffer outgoing updates, writes latest state to dest on pipe.

```js
import { ObservableStore, storeAsStream } from 'obs-store'
import pump from 'pump'

const storeOne = new ObservableStore(initState)
const storeTwo = new ObservableStore()

pump(
  storeAsStream(storeOne),
  transformStream,
  storeAsStream(storeTwo)
)
```
