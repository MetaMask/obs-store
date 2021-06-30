'use strict';

const test = require('tape');
const streamUtils = require('mississippi');
const {
  ObservableStore,
  storeAsStream,
  storeTransformStream,
  // eslint-disable-next-line import/no-unresolved
} = require('../dist');

const { pipe } = streamUtils;

test('storeTransformStream test', function (t) {
  t.plan(4);

  const initState = 'init';
  const nextState = 'next';

  const metaWrapperTransform = storeTransformStream((state) => {
    const newState = { meta: true, data: state };
    return newState;
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
