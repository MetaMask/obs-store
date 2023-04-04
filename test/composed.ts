import test from 'tape';
import { ComposedStore, ObservableStore } from '../src';

test('ComposedStore - basic', function (t) {
  t.plan(1);

  // @ts-expect-error The signature for the ObservableStore constructor makes it
  // seem like an argument is required, but we're not passing an argument here.
  const childStoreOne = new ObservableStore();
  // @ts-expect-error The signature for the ObservableStore constructor makes it
  // seem like an argument is required, but we're not passing an argument here.
  const childStoreTwo = new ObservableStore();
  const composedStore = new ComposedStore({
    // @ts-expect-error TypeScript produces an error because ComposedStore
    // isn't typed correctly.
    one: childStoreOne,
    // @ts-expect-error TypeScript produces an error because ComposedStore
    // isn't typed correctly.
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

test('ComposedStore - child initState', function (t) {
  t.plan(1);

  const childStoreOne = new ObservableStore(1);
  const childStoreTwo = new ObservableStore(2);
  const composedStore = new ComposedStore({
    // @ts-expect-error TypeScript produces an error because ComposedStore
    // isn't typed correctly.
    one: childStoreOne,
    // @ts-expect-error TypeScript produces an error because ComposedStore
    // isn't typed correctly.
    two: childStoreTwo,
  });

  t.deepEqual(
    composedStore.getState(),
    { one: 1, two: 2 },
    'composedStore gets state from children',
  );
});
