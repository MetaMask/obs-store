'use strict'

import ObservableStore = require('.')

class ComposedStore extends ObservableStore {

  _children: Record<string, ObservableStore>;

  constructor (children: Record<string, ObservableStore>) {
    super()
    // set default state
    const state = this.getState()
    if (!state) {
      this.putState({})
    }
    // subscribe to children
    this._children = children || {}
    Object.keys(this._children).forEach((childKey) => {
      const child = this._children[childKey]
      this._addChild(childKey, child)
    })
  }

  _addChild (childKey: string, child: ObservableStore) {
    const self = this
    child.subscribe(updateFromChild)
    updateFromChild(child.getState())

    function updateFromChild (childValue: Record<string, unknown>) {
      const state = self.getState()
      state[childKey] = childValue
      self.putState(state)
    }
  }

}

export = ComposedStore
