'use strict';

const TransformStream = require('stream').Transform;
const test = require('tape');
const streamUtils = require('mississippi');

const { pipe } = streamUtils;
const writeStream = streamUtils.to;
// eslint-disable-next-line import/no-unresolved
const { ObservableStore, storeAsStream } = require('../dist');

const TEST_WAIT = 200;

test('basic stream', function (t) {
  t.plan(2);

  const initState = 'init';
  const nextState = 'next';

  const storeOne = new ObservableStore(initState);
  const storeTwo = new ObservableStore();
  storeTwo.once('update', (value) => {
    initValueCheck(value);
    storeTwo.once('update', nextValueCheck);
  });

  pipe(storeAsStream(storeOne), storeAsStream(storeTwo));

  storeOne.putState(nextState);

  function initValueCheck(value) {
    t.equal(value, initState, 'storeTwo subscribed: state is initState');
  }

  function nextValueCheck(value) {
    t.equal(value, nextState, 'storeTwo subscribed: state is nextState');
  }
});

test('double stream', function (t) {
  t.plan(4);

  const initState = 'init';
  const nextState = 'next';

  const storeOne = new ObservableStore(initState);
  const storeTwo = new ObservableStore();
  storeTwo.once('update', (initValue) => {
    initValueCheck('storeTwo', initValue);
    storeTwo.once('update', (nextValue) =>
      nextValueCheck('storeTwo', nextValue),
    );
  });

  const storeThree = new ObservableStore();
  storeThree.once('update', (initValue) => {
    initValueCheck('storeThree', initValue);
    storeThree.once('update', (nextValue) =>
      nextValueCheck('storeThree', nextValue),
    );
  });

  pipe(storeAsStream(storeOne), storeAsStream(storeTwo));

  pipe(storeAsStream(storeOne), storeAsStream(storeThree));

  storeOne.putState(nextState);

  function initValueCheck(label, value) {
    t.equal(value, initState, `${label} subscribed: state is initState`);
  }

  function nextValueCheck(label, value) {
    t.equal(value, nextState, `${label} subscribed: state is nextState`);
  }
});

test('transform stream', function (t) {
  t.plan(4);

  const initState = 'init';
  const nextState = 'next';

  const metaWrapperTransform = new TransformStream({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const result = { meta: true, data: chunk };
      callback(null, result);
    },
  });

  const storeOne = new ObservableStore(initState);
  const storeTwo = new ObservableStore();
  storeTwo.once('update', (value) => {
    initValueCheck(value);
    storeTwo.once('update', nextValueCheck);
  });

  pipe(storeAsStream(storeOne), metaWrapperTransform, storeAsStream(storeTwo));

  storeOne.putState(nextState);

  function initValueCheck(value) {
    t.equal(value.meta, true, 'storeTwo subscribed: state is wrapped in meta');
    t.equal(
      value.data,
      initState,
      'storeTwo subscribed: state.data is initState',
    );
  }

  function nextValueCheck(value) {
    t.equal(value.meta, true, 'storeTwo subscribed: state is wrapped in meta');
    t.equal(
      value.data,
      nextState,
      'storeTwo subscribed: state.data is nextState',
    );
  }
});

test('basic - stream buffering', function (t) {
  t.plan(2);

  const store = new ObservableStore();
  store.putState(1);
  store.putState(2);
  store.putState(3);
  store.putState(4);
  store.putState(5);

  const itemsInStream = [];

  const sink = writeStream.obj((value, _encoding, cb) => {
    itemsInStream.push(value);
    cb();
  });

  setTimeout(pipeStreams, TEST_WAIT);

  function pipeStreams() {
    pipe(storeAsStream(store), sink);
    setTimeout(checkBuffer, TEST_WAIT);
  }

  function checkBuffer() {
    const lastItem = itemsInStream[itemsInStream.length - 1];
    t.equal(lastItem, 5, 'item in stream is latest state');
    t.equal(
      itemsInStream.length,
      1,
      'nothing extra buffered in the store stream',
    );
  }
});

test('basic - stream destroy unsubscribe', function (t) {
  t.plan(4);

  const store = new ObservableStore();
  t.equal(store.listenerCount('update'), 0);

  store.subscribe(() => undefined);
  t.equal(store.listenerCount('update'), 1);

  const storeStream = storeAsStream(store);
  t.equal(store.listenerCount('update'), 2);

  storeStream.destroy();
  t.equal(store.listenerCount('update'), 1);

  t.end();
});
