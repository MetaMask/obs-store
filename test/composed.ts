import test from 'tape';
import { ComposedStore, ObservableStore } from '../src';

test('ComposedStore - unknown state', function (t) {
  t.plan(1);

  // @ts-expect-error The signature for the ObservableStore constructor makes it
  // seem like an argument is required, but we're not passing an argument here.
  const childStoreOne = new ObservableStore();
  // @ts-expect-error The signature for the ObservableStore constructor makes it
  // seem like an argument is required, but we're not passing an argument here.
  const childStoreTwo = new ObservableStore();
  const composedStore = new ComposedStore({
    one: childStoreOne,
    two: childStoreTwo,
  });

  childStoreOne.putState(1);
  childStoreTwo.putState(2);

  t.deepEqual(
    composedStore.getState(),
    { one: 1, two: 2 },
    'composedStore gets state from children',
  );
});

test('ComposedStore - primitive state', function (t) {
  t.plan(1);

  const childStoreOne = new ObservableStore(1);
  const childStoreTwo = new ObservableStore(2);
  const composedStore = new ComposedStore({
    one: childStoreOne,
    two: childStoreTwo,
  });

  childStoreOne.putState(2);
  childStoreTwo.putState(4);

  t.deepEqual(
    composedStore.getState(),
    { one: 2, two: 4 },
    'composedStore gets state from children',
  );
});

test('ComposedStore - non-primitive state', function (t) {
  t.plan(1);

  const childStoreOne = new ObservableStore({ foo: 'bar' });
  const childStoreTwo = new ObservableStore({ baz: 'qux' });
  const composedStore = new ComposedStore({
    one: childStoreOne,
    two: childStoreTwo,
  });

  childStoreOne.putState({ foo: 'fizz' });
  childStoreTwo.putState({ baz: 'buzz' });

  t.deepEqual(
    composedStore.getState(),
    {
      one: { foo: 'buzz' },
      two: { baz: 'buzz' },
    },
    'composedStore gets state from children',
  );
});
