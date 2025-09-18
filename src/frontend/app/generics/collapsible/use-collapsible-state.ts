import { inject, provide, reactive, watchEffect, type InjectionKey } from 'vue';

export interface CollapsibleStore {
  get: (id: string) => boolean;
  set: (id: string, open: boolean) => void;
  toggle: (id: string) => boolean;
  all: () => ReadonlyMap<string, boolean>;
}

export interface CollapsibleOptions {
  /**
   * If true, collapsibles are open by default. Default: true
   */
  defaultOpen?: boolean;

  /**
   * If given, the open/closed state is persisted in localStorage under this key.
   */
  storageKey?: string;
}

const CollapsibleKey: InjectionKey<CollapsibleStore> = Symbol('CollapsibleStore');

/**
 * Create a new store instance for Collapsible components.
 *
 * @param opts - Options for the store
 * @returns A new CollapsibleStore instance
 */
export function createCollapsibleState(opts: CollapsibleOptions = {}): CollapsibleStore {
  const { defaultOpen = true, storageKey } = opts;

  const state = reactive(new Map<string, boolean>());

  // initial load
  if (storageKey) {
    try {
      const raw = globalThis.localStorage.getItem(storageKey);
      if (raw) {
        const obj = JSON.parse(raw) as Record<string, unknown>;
        for (const [k, v] of Object.entries(obj)) state.set(k, !!v);
      }
    } catch {
      // ignore parse/storage errors
    }
  }

  // persist
  if (storageKey) {
    watchEffect(() => {
      // Map -> plain object (stable in JSON)
      const obj = Object.fromEntries(state);
      globalThis.localStorage.setItem(storageKey, JSON.stringify(obj));
    });
  }

  return {
    get(id: string): boolean {
      return state.get(id) ?? defaultOpen;
    },
    set(id: string, open: unknown): void {
      state.set(id, !!open);
    },
    toggle(id: string): boolean {
      const next = !(state.get(id) ?? defaultOpen);
      state.set(id, next);
      return next;
    },
    all(): ReadonlyMap<string, boolean> {
      return state;
    },
  };
}

/**
 * Provides the CollapsibleStore to all children below.
 * (Call in parent component.)
 *
 * @param opts - Options for the store
 * @returns The created store
 */
export function provideCollapsibleState(opts?: CollapsibleOptions): CollapsibleStore {
  const store = createCollapsibleState(opts);
  provide(CollapsibleKey, store);
  return store;
}

/**
 * Retrieves the CollapsibleStore from the parent provider.
 * (Call in child component.)
 *
 * @returns The parent store
 * @throws {Error} If no parent store was provided
 */
export function useCollapsibleState(): CollapsibleStore {
  const store = inject(CollapsibleKey, undefined);
  if (!store) throw new Error('CollapsibleStore not provided in parent scope.');
  return store;
}
