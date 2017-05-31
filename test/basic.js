'use strict'

const test = require('tape')
const TransformStream = require('readable-stream').Transform
const streamUtils = require('mississippi')
const pipe = streamUtils.pipe
const streamEach = streamUtils.each
const writeStream = streamUtils.to
const ObservableStore = require('../')

const TEST_WAIT = 200


test('basic', function(t){
  t.plan(3)

  const initState = 'init'
  const nextState = 'next'
  
  const store = new ObservableStore(initState)
  store.subscribe(valueCheck)

  const firstState = store.getState()
  t.equal(store.getState(), initState, 'state is provided initState')
  
  store.putState(nextState)
  t.equal(store.getState(), nextState, 'state is nextState')

  function valueCheck(value){
    t.equal(value, nextState, 'subscribed: state is nextState')
  }

})

test('basic stream', function(t){
  t.plan(2)

  const initState = 'init'
  const nextState = 'next'
  
  const storeOne = new ObservableStore(initState)
  const storeTwo = new ObservableStore()
  storeTwo.once('update', (value) => {
    initValueCheck(value)
    storeTwo.once('update', nextValueCheck)
  })

  pipe(
    storeOne,
    storeTwo
  )

  storeOne.putState(nextState)

  function initValueCheck(value){
    t.equal(value, initState, 'storeTwo subscribed: state is initState')
  }

  function nextValueCheck(value){
    t.equal(value, nextState, 'storeTwo subscribed: state is nextState')
  }

})

test('updateState', function(t){
  t.plan(2)
  
  const storeOne = new ObservableStore({ a: true, b: false })

  storeOne.updateState({ b: true })
  const state = storeOne.getState()

  t.equal(state.a, true, 'a is present')
  t.equal(state.b, true, 'b was updated to true')
})

test('updateState non-obj onto obj', function(t){
  t.plan(2)
  
  const storeOne = new ObservableStore({ a: true })

  storeOne.updateState(2)
  const state = storeOne.getState()

  t.equal(state, 2, 'obj is wholly overwritten by value')
  t.equal(state.a, undefined, 'property is not merged onto value')
})

test('updateState obj onto non-obj', function(t){
  t.plan(2)
  
  const storeOne = new ObservableStore(2)

  storeOne.updateState({ a: true })
  const state = storeOne.getState()

  t.equal(typeof state, 'object', 'value is wholly overwritten by object')
  t.equal(state.a, true, 'a is present')
})


test('double stream', function(t){
  t.plan(4)

  const initState = 'init'
  const nextState = 'next'
  
  const storeOne = new ObservableStore(initState)
  const storeTwo = new ObservableStore()
  storeTwo.once('update', (initValue) => {
    initValueCheck('storeTwo', initValue)
    storeTwo.once('update', (nextValue) => nextValueCheck('storeTwo', nextValue))
  })

  const storeThree = new ObservableStore()
  storeThree.once('update', (initValue) => {
    initValueCheck('storeThree', initValue)
    storeThree.once('update', (nextValue) => nextValueCheck('storeThree', nextValue))
  })

  pipe(
    storeOne,
    storeTwo
  )

  pipe(
    storeOne,
    storeThree
  )

  storeOne.putState(nextState)

  function initValueCheck(label, value){
    t.equal(value, initState, `${label} subscribed: state is initState`)
  }

  function nextValueCheck(label, value){
    t.equal(value, nextState, `${label} subscribed: state is nextState`)
  }

})

test('transform stream', function(t){
  t.plan(4)

  const initState = 'init'
  const nextState = 'next'

  const metaWrapperTransform = new TransformStream({
    objectMode: true,
    transform (chunk, encoding, callback) {
      const result = { meta: true, data: chunk }
      callback(null, result)
    },
  })
  
  const storeOne = new ObservableStore(initState)
  const storeTwo = new ObservableStore()
  storeTwo.once('update', (value) => {
    initValueCheck(value)
    storeTwo.once('update', nextValueCheck)
  })

  pipe(
    storeOne,
    metaWrapperTransform,
    storeTwo
  )

  storeOne.putState(nextState)

  function initValueCheck(value){
    t.equal(value.meta, true, 'storeTwo subscribed: state is wrapped in meta')
    t.equal(value.data, initState, 'storeTwo subscribed: state.data is initState')
  }

  function nextValueCheck(value){
    t.equal(value.meta, true, 'storeTwo subscribed: state is wrapped in meta')
    t.equal(value.data, nextState, 'storeTwo subscribed: state.data is nextState')
  }

})


test('basic - stream buffering', function(t){
  t.plan(2)
  
  const store = new ObservableStore()
  store.putState(1)
  store.putState(2)
  store.putState(3)
  store.putState(4)
  store.putState(5)

  let itemsInStream = []

  let sink = writeStream.obj((value, enc, cb) => {
    itemsInStream.push(value)
    cb()
  })

  setTimeout(pipeStreams, TEST_WAIT)

  function pipeStreams() {
    pipe(
      store,
      sink
    )
    setTimeout(checkBuffer, TEST_WAIT)
  }

  function checkBuffer() {
    const lastItem = itemsInStream.slice(-1)[0]
    t.equal(lastItem, 5, 'item in stream is latest state')
    t.equal(itemsInStream.length, 1, 'nothing extra buffered in the store stream')
  }
})
