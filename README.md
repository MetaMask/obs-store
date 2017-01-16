# ObservableStore

`ObservableStore` is a synchronous in-memory store for a single value,
that you can subscribe to updates on.

```js
const store = new ObservableStore({ initState: initState })
store.subscribe(function showValue(value) {
  console.log('saw value:', value)
})

store.putState(5) // "saw value: 5"
store.putState(true) // "saw value: true"
store.putState({ hello: 'world' }) // "saw value: { hello: 'world' }"

console.log(store.getState().hello) // "world"
```

### streams

Each `ObservableStore` is a duplex stream.
You can pipe new values into it and pipe its updated values out of it.

```js
const storeOne = new ObservableStore({ initState: initState })
const storeTwo = new ObservableStore()

pipe(
  storeOne,
  transformStream,
  storeTwo
)
```