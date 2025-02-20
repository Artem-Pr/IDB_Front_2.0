type NonFalsy<T> = T extends false | 0 | '' | null | undefined | 0n
  ? never
  : T

declare global {
  interface ObjectConstructor {
    keys<T>(obj: T): Array<keyof T>
    keys<T extends string>(obj: Record<T, any>): string[]

    // entries<T>(o: { [s in keyof T]: T; } | ArrayLike<T>): [keyof T, T][];
    // entries<T>(o: { [s: string]: T; } | ArrayLike<T>): [string, T][];
  }

  interface Array<T> {
    // filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    // filter<S extends T>(predicate: (value: T, index: number, array: T[]) => boolean): S[];
    filter<S extends T>(predicate: BooleanConstructor, thisArg?: any): NonFalsy<S>[];
  }

  type WidenLiteral<T> = T extends string
    ? string
    : T extends number
      ? number
      : T extends boolean
        ? boolean
        : T extends bigint
          ? bigint
          : T extends symbol
            ? symbol
            : T

  interface Array<T> {
  // .includes now takes a WidenLiteral as the first parameter
    includes(
      searchElement: T | (WidenLiteral<T> & {}),
      fromIndex?: number
    ): boolean;
  }

  interface ReadonlyArray<T> {
  // .includes now takes a WidenLiteral as the first parameter
    includes(
      searchElement: T | (WidenLiteral<T> & {}),
      fromIndex?: number
    ): boolean;
  }

  type NonNullableFields<T extends object, P extends keyof T = keyof T> = {
    [K in keyof T]: K extends P ? NonNullable<T[K]> : T[K];
  }
}

export default global
