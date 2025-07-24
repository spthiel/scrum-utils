export type Dict<T> = Record<string, T>;
export type Consumer<T> = (value: T) => unknown;
export type Runnable = () => unknown;
export type Supplier<T> = () => T;
export type Function<V, R> = (value: V) => R;
