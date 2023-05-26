export { defineConfig, type InterflexConfig } from "../shared/config.js";

type LeafKeys<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T]-?: T[K] extends object
        ? `${Prefix}${LeafKeys<T[K], `${Extract<K, string>}.`>}`
        : `${Prefix}${Extract<K, string>}`;
    }[keyof T]
  : never;

type ExcludeTopLevelKeys<T> = T extends `${infer _}.${infer Rest}` ? Rest : T;

export type InterflexKey<T> = ExcludeTopLevelKeys<LeafKeys<T>> extends never
  ? never
  : ExcludeTopLevelKeys<LeafKeys<T>>;
