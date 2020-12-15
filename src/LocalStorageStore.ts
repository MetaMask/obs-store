'use strict';

import { ObservableStore } from './ObservableStore';

export class LocalStorageStore extends ObservableStore {

  private _storageKey: string;

  constructor(opts: { storageKey?: string } = {}) {
    if (!(global as unknown as Window).localStorage) {
      throw new Error('LocalStorageStore - can\'t find localStorage.');
    }
    super();
    if (!opts.storageKey) {
      throw new Error('LocalStorageStore - no storageKey specified.');
    }
    this._storageKey = opts.storageKey;
  }

  //
  // private
  //

  // read from persistence
  _getState() {
    const serialized = (global as unknown as Window).localStorage.getItem(this._storageKey);
    return serialized ? JSON.parse(serialized) : undefined;
  }

  // write to persistence
  _putState(newState: Record<string, unknown>) {
    const serialized = JSON.stringify(newState);
    return (global as unknown as Window).localStorage.setItem(this._storageKey, serialized);
  }

}
