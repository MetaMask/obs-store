import test from 'tape';
import { ObservableStore } from '../src';

test('basic', function (t) {
  t.plan(3);

  const initState = 'init';
  const nextState = 'next';

  const store = new ObservableStore(initState);
  store.subscribe(valueCheck);

  t.equal(store.getState(), initState, 'state is provided initState');

  store.putState(nextState);
  t.equal(store.getState(), nextState, 'state is nextState');

  function valueCheck(value) {
    t.equal(value, nextState, 'subscribed: state is nextState');
  }
});

test('default state', function (t) {
  t.plan(3);

  const nextState = 'next';

  // @ts-expect-error The signature for the ObservableStore constructor makes it
  // seem like an argument is required, but we're not passing an argument here.
  const store = new ObservableStore();
  store.subscribe(valueCheck);

  t.deepEqual(store.getState(), {}, 'default state of empty object is set');

  store.putState(nextState);
  t.equal(store.getState(), nextState, 'state is nextState');

  function valueCheck(value) {
    t.equal(value, nextState, 'subscribed: state is nextState');
  }
});

test('falsy non-undefined initial state', function (t) {
  t.plan(3);

  const initState = null;
  const nextState = 'next';

  const store = new ObservableStore(initState);
  store.subscribe(valueCheck);

  t.equal(store.getState(), initState, 'null default state is set');

  store.putState(nextState);
  t.equal(store.getState(), nextState, 'state is nextState');

  function valueCheck(value) {
    t.equal(value, nextState, 'subscribed: state is nextState');
  }
});

test('updateState', function (t) {
  t.plan(2);

  const storeOne = new ObservableStore({ a: true, b: false });

  storeOne.updateState({ b: true });
  const state = storeOne.getState();

  t.equal(state.a, true, 'a is present');
  t.equal(state.b, true, 'b was updated to true');
});

test('updateState non-obj onto obj', function (t) {
  t.plan(2);

  const storeOne = new ObservableStore({ a: true });

  // @ts-expect-error We're intentionally trying to update an object state with
  // a non-object.
  storeOne.updateState(2);
  const state = storeOne.getState();

  t.equal(state, 2, 'obj is wholly overwritten by value');
  t.equal(state.a, undefined, 'property is not merged onto value');
});

test('updateState obj onto non-obj', function (t) {
  t.plan(2);

  const storeOne = new ObservableStore(2);

  // @ts-expect-error We're intentionally trying to update an non-object state
  // with an object.
  storeOne.updateState({ a: true });
  const state = storeOne.getState();

  t.equal(typeof state, 'object', 'value is wholly overwritten by object');
  // @ts-expect-error The interface for `ObservableStore` does not allow
  // changing the type of the whole state, but `updateState` overwrites the
  // state object anyway.
  t.equal(state.a, true, 'a is present');
});
