/// <reference types="node" />

import events = require("events");

type State = Record<string, any>

export class ObservableStore extends events.EventEmitter {
  constructor(state: State);
  getState(): State;
  putState(s: State): void;
  updateState(s: State): void;
  subscribe(fn: (...args: any[]) => void): void;
  unsubscribe(fn: (...args: any[]) => void): void;
}