'use strict'

const ObservableStore = require('../')


class LocalStorageStore extends ObservableStore {

  constructor (opts = {}) {
    if (!global.localStorage) throw new Error('LocalStorageStore - can\'t find localStorage.')
    super()
    this._storageKey = opts.storageKey
    if (!this._storageKey) throw new Error('LocalStorageStore - no storageKey specified.')
  }

  //
  // private
  //

  // read from persistence
  _getState () {
    const serialized = global.localStorage[this._storageKey]
    return JSON.parse(serialized)
  }

  // write to persistence
  _putState (newState) {
    const serialized = JSON.stringify(newState)
    return global.localStorage[this._storageKey] = serialized
  }

}

module.exports = LocalStorageStore