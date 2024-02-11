declare global {
  interface ObjectConstructor {
    keys<T>(obj: T): Array<keyof T>
    keys<T extends string>(obj: Record<T, any>): string[]

    // entries<T>(o: { [s in keyof T]: T; } | ArrayLike<T>): [keyof T, T][];
    // entries<T>(o: { [s: string]: T; } | ArrayLike<T>): [string, T][];
  }

  interface Array<T> {
    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => boolean): S[];
  }
}

export default global
