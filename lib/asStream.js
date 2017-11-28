const DuplexStream = require('stream').Duplex

module.exports = asStream


function asStream(obsStore) {
  return new ObsStoreStream(obsStore)
}

//
//
//
//

class ObsStoreStream extends DuplexStream {

  constructor(obsStore) {
    super({
      // pass values, not serializations
      objectMode: true,
    })
    // dont buffer outgoing updates
    this.resume()
    // subscribe to obsStore changes
    this.obsStore = obsStore
    this.obsStore.subscribe((state) => this.push(state))
  }

  // emit current state on new destination
  pipe (dest, options) {
    const result = DuplexStream.prototype.pipe.call(this, dest, options)
    dest.write(this.obsStore.getState())
    return result
  }

  // write from incomming stream to state
  _write (chunk, encoding, callback) {
    this.obsStore.putState(chunk)
    callback()
  }

  // noop - outgoing stream is asking us if we have data we arent giving it
  _read (size) { }

}

