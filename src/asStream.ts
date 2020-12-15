import { Duplex as DuplexStream } from 'stream';

import { ObservableStore } from './ObservableStore';

class StoreStream extends DuplexStream {

  handler: (s: Record<string, unknown>) => void;

  obsStore: ObservableStore;

  constructor(obsStore: ObservableStore) {
    super({
      // pass values, not serializations
      objectMode: true,
    });
    // dont buffer outgoing updates
    this.resume();
    // save handler so we can unsubscribe later
    this.handler = (state: Record<string, unknown>) => this.push(state);
    // subscribe to obsStore changes
    this.obsStore = obsStore;
    this.obsStore.subscribe(this.handler);
  }

  // emit current state on new destination
  pipe<T extends NodeJS.WritableStream>(dest: T, options?: { end?: boolean }): T {
    const result = super.pipe(dest, options);
    dest.write(this.obsStore.getState() as any);
    return result;
  }

  // write from incoming stream to state
  _write(chunk: any, _encoding: string, callback: (error?: Error | null) => void): void {
    this.obsStore.putState(chunk);
    callback();
  }

  // noop - outgoing stream is asking us if we have data we arent giving it
  _read(_size: number) {
    return undefined;
  }

  // unsubscribe from event emitter
  _destroy(err: Error | null, callback: (error: Error | null) => void): void {
    this.obsStore.unsubscribe(this.handler);
    super._destroy(err, callback);
  }
}

export function storeAsStream(obsStore: ObservableStore) {
  return new StoreStream(obsStore);
}
