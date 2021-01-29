import { obj as TransformStream } from 'through2';

export function storeTransformStream<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>
>(syncTransformFn: (state: T) => U) {
  return TransformStream((state, _encoding, cb) => {
    try {
      const newState = syncTransformFn(state);
      cb(null, newState);
      return undefined;
    } catch (err) {
      cb(err);
      return undefined;
    }
  });
}
