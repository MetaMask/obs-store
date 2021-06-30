import SafeEventEmitter from '@metamask/safe-event-emitter';

export class ObservableStore<T> extends SafeEventEmitter {
  private _state: T;

  constructor(initState: T) {
    super();
    if (initState) {
      this._state = initState;
    } else {
      // Typecast/default state: Preserve existing behavior
      this._state = {} as unknown as T;
    }
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

  updateState(partialState: Partial<T>): void {
    // if non-null object, merge
    if (partialState && typeof partialState === 'object') {
      const state = this.getState();
      this.putState({ ...state, ...partialState });
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
  protected _getState(): T {
    return this._state;
  }

  // write to persistence
  protected _putState(newState: T): void {
    this._state = newState;
  }
}
