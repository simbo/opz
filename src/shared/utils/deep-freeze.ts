import type { ReadonlyDeep } from 'type-fest';

/**
 * Deeply freezes an object, making it and all nested properties immutable.
 *
 * @param obj - The object to deeply freeze.
 * @returns The deeply frozen object.
 */
export function deepFreeze<T>(obj: T): ReadonlyDeep<T> {
  Object.freeze(obj);

  for (const key of Object.getOwnPropertyNames(obj)) {
    const value = (obj as Record<string, unknown>)[key];
    if (value !== undefined && typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  return obj as ReadonlyDeep<T>;
}
