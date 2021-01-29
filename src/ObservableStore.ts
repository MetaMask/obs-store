import SafeEventEmitter from '@metamask/safe-event-emitter';

export class ObservableStore<T extends Record<string, unknown>> extends SafeEventEmitter {

  private _state: T;

  // Typecast: Preserve existing behavior
  constructor(initState: T = {} as unknown as T) {
    super();
    // set init state
    this._state = initState;
  }

  // wrapper around internal getState
  getState(): T {
    return this._getState();
  }

  // wrapper around internal putState
  putState(newState: T): void {
    this._putState(newState);
    this.emit('update', newState);
  }

  updateState(partialState: T): void {
    // if non-null object, merge
    if (partialState && typeof partialState === 'object') {
      const state = this.getState();
      const newState = Object.assign({}, state, partialState);
      this.putState(newState);
    // if not object, use new value
    } else {
      this.putState(partialState);
    }
  }

  // subscribe to changes
  subscribe(handler: (state: T) => void): void {
    this.on('update', handler);
  }

  // unsubscribe to changes
  unsubscribe(handler: (state: T) => void): void {
    this.removeListener('update', handler);
  }

  //
  // private
  //

  // read from persistence
  _getState(): T {
    return this._state;
  }

  // write to persistence
  _putState(newState: T): void {
    this._state = newState;
  }
}
