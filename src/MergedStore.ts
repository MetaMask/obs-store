import { ObservableStore } from './ObservableStore';

export class MergedStore extends ObservableStore {

  private _children: ObservableStore[];

  constructor(children = []) {
    super();
    // set default state
    const state = this.getState();
    if (!state) {
      this.putState({});
    }
    this._children = children;
    // subscribe to children
    children.forEach((child) => this._addChild(child));
    this._updateWholeState();
  }

  _addChild(child: ObservableStore) {
    child.subscribe(() => this._updateWholeState());
  }

  _updateWholeState() {
    const childStates = this._children.map((child) => child.getState());
    // apply shallow merge over states
    const state = Object.assign({}, ...childStates);
    this.putState(state);
  }
}
