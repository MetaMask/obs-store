import { ObservableStore } from './ObservableStore';

export class ComposedStore extends ObservableStore {

  _children: Record<string, ObservableStore>;

  constructor(children: Record<string, ObservableStore>) {
    super();
    // set default state
    const state = this.getState();
    if (!state) {
      this.putState({});
    }
    // subscribe to children
    this._children = children || {};
    Object.keys(this._children).forEach((childKey) => {
      const child = this._children[childKey];
      this._addChild(childKey, child);
    });
  }

  _addChild(childKey: string, child: ObservableStore) {
    const updateFromChild = (childValue: Record<string, unknown>) => {
      const state = this.getState();
      state[childKey] = childValue;
      this.putState(state);
    };

    child.subscribe(updateFromChild);
    updateFromChild(child.getState());
  }
}
