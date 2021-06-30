import { ObservableStore } from './ObservableStore';

export class MergedStore<
  T extends Record<string, unknown>,
> extends ObservableStore<T> {
  private _children: ObservableStore<Partial<T>>[];

  constructor(children = []) {
    // Typecast: Preserve existing behavior
    super({} as unknown as T);

    this._children = children;
    // subscribe to children
    children.forEach((child) => this._addChild(child));
    this._updateWholeState();
  }

  _addChild(child: ObservableStore<Partial<T>>): void {
    child.subscribe(() => this._updateWholeState());
  }

  _updateWholeState(): void {
    const childStates = this._children.map((child) => child.getState());
    // apply shallow merge over states
    const state = Object.assign({}, ...childStates);
    this.putState(state);
  }
}
