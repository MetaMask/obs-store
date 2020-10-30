import SafeEventEmitter from '@metamask/safe-event-emitter';

class ObservableStore extends SafeEventEmitter {

  private _state: Record<string, unknown>;

  constructor (initState = {}) {
    super()
    // set init state
    this._state = initState
  }

  // wrapper around internal getState
  getState () {
    return this._getState()
  }

  // wrapper around internal putState
  putState (newState: Record<string, unknown>) {
    this._putState(newState)
    this.emit('update', newState)
  }

  updateState (partialState: Record<string, unknown>) {
    // if non-null object, merge
    if (partialState && typeof partialState === 'object') {
      const state = this.getState()
      const newState = Object.assign({}, state, partialState)
      this.putState(newState)
    // if not object, use new value
    } else {
      this.putState(partialState)
    }
  }

  // subscribe to changes
  subscribe (handler: (s: Record<string, unknown>) => void) {
    this.on('update', handler)
  }

  // unsubscribe to changes
  unsubscribe (handler: (s: Record<string, unknown>) => void) {
    this.removeListener('update', handler)
  }

  //
  // private
  //

  // read from persistence
  _getState () {
    return this._state
  }

  // write to persistence
  _putState (newState: Record<string, unknown>) {
    this._state = newState
  }
}

export = ObservableStore
