<script setup lang="ts">
import { computed } from 'vue';

import Collapsible from '../../generics/collapsible/collapsible.vue';
import { useCollapsibleState } from '../../generics/collapsible/use-collapsible-state';
import Icon from '../../generics/icon/icon.vue';

import type { Repo } from '../../../../shared/repos/repo.interface';
import type { ReposDirectory } from '../../../../shared/repos/repos-directory.interface';
import ReposListRepo from './repos-list-repo.vue';

const props = defineProps<{
  reposDir: ReposDirectory;
}>();

const collapsibleStore = useCollapsibleState();

const repos = computed(() => props.reposDir.repos.toSorted((a: Repo, b: Repo) => a.basename.localeCompare(b.basename)));

const dirs = computed(() =>
  props.reposDir.dirs.toSorted((a: ReposDirectory, b: ReposDirectory) => a.label.localeCompare(b.label)),
);

const open = computed<boolean>({
  get: () => collapsibleStore.get(props.reposDir.path),
  set: v => {
    collapsibleStore.set(props.reposDir.path, v);
  },
});
</script>

<template>
  <div class="repos-list__item--dir">
    <Collapsible v-model="open" :id="reposDir.path">
      <template #label>
        <div
          :class="{
            'repos-list__label': true,
            'is-open': open,
          }"
        >
          <Icon name="triangle-right" />
          <div class="repos-list__name">{{ reposDir.label }}</div>
        </div>
      </template>
      <div class="repos-list__children">
        <ReposListRepo v-for="repo in repos" :key="repo.path" :repo="repo" />
        <ReposListDir v-for="dir in dirs" :key="dir.path" :repos-dir="dir" />
      </div>
    </Collapsible>
  </div>
</template>
