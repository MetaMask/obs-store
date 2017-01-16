const ObservableStore = require('../')


class ComposedStore extends ObservableStore {

  constructor (opts = {}) {
    super(opts)
    // set default state
    let state = this.getState()
    if (!state) this.putState({})
    // subscribe to children
    this._children = opts.children || {}
    Object.keys(this._children).forEach((childKey) => {
      let child = this._children[childKey]
      this._addChild(childKey, child)
    })
  }

  _addChild (childKey, child) {
    const self = this
    child.subscribe(updateChild)
    updateChild(child.getState())

    function updateChild(childValue) {
      let state = self.getState()
      state[childKey] = childValue
      self.putState(state)
    }
  }

}

module.exports = ComposedStore