'use strict'

const DuplexStream = require('stream').Duplex

class ObservableStore extends DuplexStream {

  constructor (initState = {}) {
    // construct as duplex stream
    super({
      // pass values not serializations
      objectMode: true,
      // a writer can end and we are still readable
      allowHalfOpen: true,
    })
    // dont buffer outgoing updates
    this.resume()
    // set init state
    this._state = initState
  }

  // wrapper around internal getState
  getState () {
    return this._getState()
  }
  
  // wrapper around internal putState
  putState (newState) {
    this._putState(newState)
    this.emit('update', newState)
    this.push(this.getState())
  }

  // subscribe to changes
  subscribe (handler) {
    this.on('update', handler)
  }

  // unsubscribe to changes
  unsubscribe (handler) {
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
  _putState (newState) {
    this._state = newState
  }

  //
  // stream implementation
  //

  // emit current state on new destination
  pipe (dest, options) {
    const result = DuplexStream.prototype.pipe.call(this, dest, options)
    dest.write(this.getState())
    return result
  }

  // write from incomming stream to state
  _write (chunk, encoding, callback) {
    this.putState(chunk)
    callback()
  }

  // noop - outgoing stream is asking us if we have data we arent giving it
  _read (size) { }

}

module.exports = ObservableStore
