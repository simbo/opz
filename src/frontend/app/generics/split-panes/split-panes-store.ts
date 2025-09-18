import { defineStore } from 'pinia';
import { computed, getCurrentScope, onScopeDispose, type WritableComputedRef } from 'vue';

export type Key = string;
export type Value = number[];

/**
 * A store to manage persistent split pane sizes identified by keys.
 * Each key maps to an array of numbers representing the sizes of panes.
 *
 * Usage:
 *   <script>
 *     const splitPanesStore = useSplitPanesStore();
 *     const paneSizes = splitPanesStore.itemRef('my-panes', [30, 70]);
 *   </script>
 *   <template>
 *     <SplitPanes v-model:sizes="paneSizes" direction="horizontal">
 *       <template #pane0>...</template>
 *       <template #pane1>...</template>
 *     </SplitPanes>
 *   </template>
 */
export const useSplitPanesStore = defineStore('split-panes', {
  state: () => ({
    map: new Map<Key, Value>(),
  }),

  getters: {
    get: state => (key: Key) => state.map.get(key),
  },

  actions: {
    set(key: Key, value: Value) {
      this.map.set(key, value);
    },
    remove(key: Key) {
      this.map.delete(key);
    },
    clear() {
      this.map.clear();
    },

    /**
     * Returns a memoized writable computed ref for a given key.
     * The returned ref updates when the corresponding Map entry changes
     * (set/delete/clear affecting this key) and can also be *assigned to*
     * in order to update the Map. Assigning `undefined` deletes the key.
     *
     * @param key - The key to get the computed ref for.
     * @param defaultValue - Default/initial value if the key is not present yet.
     * @returns A WritableComputedRef that reflects the current value for the
     * key (or default), and writes through to the Map when assigned.
     */
    itemRef(key: Key, defaultValue?: Value): WritableComputedRef<Value | undefined> {
      // Store-private cache (NOT in state to avoid serialization/devtools noise).
      // Each key maps to a single computed ref plus a usage counter.
      const self = this as unknown as {
        __itemRefCache?: Map<Key, { ref: WritableComputedRef<Value | undefined>; uses: number; defaultValue?: Value }>;
      };
      self.__itemRefCache ??= new Map();

      // Reuse existing computed if available and track another consumer.
      const cached = self.__itemRefCache.get(key);
      if (cached) {
        cached.uses++;

        // If called within a Vue effect scope (e.g., inside setup()),
        // register disposal to decrement usage and auto-remove from cache.
        if (getCurrentScope()) {
          onScopeDispose(() => {
            cached.uses--;
            if (cached.uses <= 0) self.__itemRefCache?.delete(key);
          });
        }
        return cached.ref;
      }

      // Create a writable computed that tracks Map.get(key) and falls back to defaultValue.
      // Vue 3 tracks Map operations; this recomputes on set/delete/clear for this key.
      const ref = computed<Value | undefined>({
        get: () => this.map.get(key) ?? defaultValue,
        set: value => {
          if (value === undefined) {
            this.remove(key);
            return;
          }
          this.set(key, value);
        },
      });

      // Insert into cache with initial usage = 1 (this caller).
      self.__itemRefCache.set(key, { ref, uses: 1, defaultValue });

      // If inside a component/composable scope, ensure cleanup on unmount/dispose.
      if (getCurrentScope()) {
        onScopeDispose(() => {
          const entry = self.__itemRefCache?.get(key);
          if (!entry) return;
          entry.uses--;
          if (entry.uses <= 0) self.__itemRefCache?.delete(key);
        });
      }

      // Return the memoized computed ref.
      return ref;
    },
  },

  persist: {
    storage: window.localStorage,
    pick: ['map'],
    serializer: {
      serialize: value => {
        const map = [...(value.map as Map<Key, Value>).entries()];
        return JSON.stringify({ map });
      },
      deserialize: value => {
        const { map } = JSON.parse(value) as { map: [Key, Value][] };
        return { map: new Map<Key, Value>(map) };
      },
    },
  },
});
