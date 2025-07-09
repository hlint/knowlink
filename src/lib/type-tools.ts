export type MapType<T, U> = T extends object
  ? { [K in keyof T]: MapType<T[K], U> }
  : U;

export type RestParameters<T> = T extends (
  first: string,
  ...args: infer R
) => unknown
  ? R
  : never;
