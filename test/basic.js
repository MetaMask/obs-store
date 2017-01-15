const test = require('tape')
const TransformStream = require('readable-stream').Transform
const pipe = require('pump')
const ObservableStore = require('../')


test('basic test', function(t){
  t.plan(3)

  const initState = 'init'
  const nextState = 'next'
  
  const store = new ObservableStore({ label: 'store', initState: initState })
  store.subscribe(valueCheck)

  const firstState = store.getState()
  t.equal(store.getState(), initState, 'state is provided initState')
  
  store.putState(nextState)
  t.equal(store.getState(), nextState, 'state is nextState')

  function valueCheck(value){
    t.equal(value, nextState, 'subscribed: state is nextState')
  }

})

test('basic stream test', function(t){
  t.plan(2)

  const initState = 'init'
  const nextState = 'next'
  
  const storeOne = new ObservableStore({ label: 'storeOne', initState: initState })
  const storeTwo = new ObservableStore({ label: 'storeTwo' })
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

test('transform stream test', function(t){
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
  
  const storeOne = new ObservableStore({ label: 'storeOne', initState: initState })
  const storeTwo = new ObservableStore({ label: 'storeTwo' })
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