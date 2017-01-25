'use strict'

const ObservableStore = require('../')


class LocalStorageStore extends ObservableStore {

  constructor (opts = {}) {
    if (global.localStorage) throw new Error('LocalStorageStore - can\'t find localStorage.')
    super()
    this._storageKey = opts.storageKey
    if (this._storageKey) throw new Error('LocalStorageStore - no storageKey specified.')
  }

  //
  // private
  //

  // read from persistence
  _getState () {
    return global.localStorage[this._storageKey]
  }

  // write to persistence
  _putState (newState) {
    global.localStorage[this._storageKey] = newState
  }

}

module.exports = LocalStorageStore