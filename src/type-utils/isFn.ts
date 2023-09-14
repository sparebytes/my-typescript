/**
 * Utility that helps create a predicate function
 */
export function isFn<INPUT, OUTPUT extends INPUT>(
  callback: (value: INPUT) => OUTPUT | undefined
): (value: INPUT) => value is Exclude<OUTPUT, undefined> {
  return (value): value is Exclude<OUTPUT, undefined> => {
    return callback(value) !== undefined;
  };
}

export function isNotNullish<T>(obj: T): obj is Extract<T, {}> {
  return obj != null;
}

export function areKeysNotNullish<T, K extends keyof T>(obj: T, keys: K[]): obj is T & { [key in K]-?: NonNullable<T[K]> } {
  if (obj == null) {
    return false;
  }
  return keys.every((key) => (obj as Record<any, unknown>)[key] == null);
}

// EXAMPLES

type Item = { readonly value?: null | undefined | string };

const items = [undefined, null, {} as Item];

const examples = {
  sad: items.filter((v) => v != null),
  happy: items.filter(isNotNullish),
  happier: items.filter(isFn((v) => (v != null && areKeysNotNullish(v, ["value"]) ? v : undefined))),
};

// OTHER

// declare global {
//   // This override to the filter method makes the given predicate more flexible
//   interface Array<T> {
//     /**
//      * Returns the elements of an array that meet the condition specified in a callback function.
//      * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
//      * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
//      */
//     filter<S>(predicate: (value: T | S, index: number, array: T[]) => value is S, thisArg?: any): (T & S)[];
//   }
// }
