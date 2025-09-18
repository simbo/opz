<script setup lang="ts">
import { onMounted } from 'vue';

import { storeToRefs } from 'pinia';
import { useSplitPanesStore } from '../generics/split-panes/split-panes-store';
import SplitPanes from '../generics/split-panes/split-panes.vue';
import ReposList from './repos-list/repos-list.vue';
import { useReposTreeStore } from './repos-tree-store';

const reposTreeStore = useReposTreeStore();

const { tree, error } = storeToRefs(reposTreeStore);

const splitPanesStore = useSplitPanesStore();

const DEFAULT_PANE_LEFT_SIZE = 28;
const DEFAULT_PANE_RIGHT_SIZE = 72;

const paneSizes = splitPanesStore.itemRef('repos-view-panes', [DEFAULT_PANE_LEFT_SIZE, DEFAULT_PANE_RIGHT_SIZE]);

onMounted(async () => {
  if (!tree.value) {
    await reposTreeStore.update();
  }
});
</script>

<template>
  <div class="error" v-if="error">{{ error }}</div>
  <template v-else-if="tree">
    <SplitPanes v-model:sizes="paneSizes" direction="horizontal">
      <template #pane0>
        <div class="repos-view__list">
          <ReposList :repos-dir="tree" />
        </div>
      </template>
      <template #pane1>
        <div class="repos-view__details"></div>
      </template>
    </SplitPanes>
  </template>
</template>

<style lang="scss" scoped>
.repos-view {
  &__details,
  &__list {
    min-height: 100%;
  }

  &__list {
    border-right: var(--border-width--s) solid var(--border-color--default);
  }
}
</style>
