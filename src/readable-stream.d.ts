// eslint-disable import/unambiguous
declare module 'readable-stream' {
  export { Duplex, Transform, Writable, pipeline } from 'stream';
  export type { DuplexOptions, TransformOptions } from 'stream';
}
