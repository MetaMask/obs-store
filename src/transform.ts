import { Transform } from 'readable-stream';

export function storeTransformStream<T, U>(syncTransformFn: (state: T) => U) {
  const t = new Transform({
    objectMode: true,
    transform: (state, _encoding, cb) => {
      try {
        const newState = syncTransformFn(state);
        cb(undefined, newState);
        return undefined;
      } catch (err) {
        cb(err);
        return undefined;
      }
    },
  });
  return t;
}
