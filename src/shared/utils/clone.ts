import type { WritableDeep } from 'type-fest';

/**
 * Deep clones an object using JSON serialization.
 *
 * @param obj - The object to clone
 * @returns A deep clone of the input object
 */
export function clone<T>(obj: T): WritableDeep<T> {
  // eslint-disable-next-line unicorn/prefer-structured-clone
  return JSON.parse(JSON.stringify(obj)) as WritableDeep<T>;
}
