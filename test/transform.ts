import test from 'tape';
import { pipeline } from 'readable-stream';
import { ObservableStore, storeAsStream, storeTransformStream } from '../src';

test('storeTransformStream test', function (t) {
  t.plan(4);

  const initState = 'init';
  const nextState = 'next';

  const metaWrapperTransform = storeTransformStream((state) => {
    const newState = { meta: true, data: state };
    return newState;
  });

  const storeOne = new ObservableStore(initState);
  // @ts-expect-error The signature for the ObservableStore constructor makes it
  // seem like an argument is required, but we're not passing an argument here.
  const storeTwo = new ObservableStore();
  storeTwo.once('update', (value) => {
    initValueCheck(value);
    storeTwo.once('update', nextValueCheck);
  });

  pipeline(
    storeAsStream(storeOne),
    metaWrapperTransform,
    storeAsStream(storeTwo),
  );

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
