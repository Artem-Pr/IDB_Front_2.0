/* eslint-disable functional/no-method-signature */
declare global {
  interface ObjectConstructor {
    typedKeys<T>(obj: T): Array<keyof T>
  }
}

export default global
