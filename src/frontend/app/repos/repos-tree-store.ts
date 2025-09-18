import { defineStore } from 'pinia';

import type { ReposDirectory } from '../../../shared/repos/repos-directory.interface';

const TREE_TTL = 60_000;

export const useReposTreeStore = defineStore('repos-tree', {
  state: () => ({
    tree: undefined as ReposDirectory | undefined,
    loading: false as boolean,
    error: undefined as unknown,
    timestamp: 0 as number,
  }),

  getters: {
    stale: s => !s.tree || Date.now() - s.timestamp >= TREE_TTL,
  },

  actions: {
    /**
     * Ensure the tree is loaded and up to date.
     *
     * @param force - If true, will reload the tree even if it's not stale.
     */
    async update(force = false): Promise<void> {
      if (!force && this.tree && !this.stale) return;
      await this.load();
    },

    /**
     * Load the repository tree from the main process.
     */
    async load(): Promise<void> {
      this.$patch(s => {
        s.loading = true;
      });
      try {
        const tree = await window.ipc.reposTree();
        this.$patch(s => {
          s.tree = tree;
          s.timestamp = Date.now();
          s.loading = false;
        });
      } catch (error) {
        this.$patch(s => {
          s.loading = false;
          s.error = error;
        });
      }
    },
  },
});
