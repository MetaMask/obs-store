import { ObservableStore } from './ObservableStore';

export class ComposedStore<
  T extends Record<string, Record<string, unknown>>,
> extends ObservableStore<T> {
  private _children: Record<keyof T, ObservableStore<T[keyof T]>>;

  constructor(children: Record<keyof T, ObservableStore<T[keyof T]>>) {
    // Typecast: Preserve existing behavior
    super({} as unknown as T);

    // subscribe to children
    this._children = children || {};
    Object.keys(this._children).forEach((childKey) => {
      const child = this._children[childKey];
      this._addChild(childKey, child);
    });
  }

  _addChild(childKey: keyof T, child: ObservableStore<T[keyof T]>) {
    const updateFromChild = (childValue: T[keyof T]) => {
      const state = this.getState();
      state[childKey] = childValue;
      this.putState(state);
    };

    child.subscribe(updateFromChild);
    updateFromChild(child.getState());
  }
}
