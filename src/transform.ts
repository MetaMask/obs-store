import { Transform } from 'readable-stream';
import type { TransformOptions } from 'readable-stream';

export function storeTransformStream<T, U>(
  syncTransformFn: (state: T) => U,
  streamOptions: TransformOptions = {},
) {
  const t = new Transform({
    objectMode: true,
    transform: (
      state: T,
      _encoding: unknown,
      cb: (error?: Error | null, data?: U) => void,
    ) => {
      try {
        const newState = syncTransformFn(state);
        cb(undefined, newState);
        return undefined;
      } catch (err) {
        cb(err);
        return undefined;
      }
    },
    ...streamOptions,
  });
  return t;
}
