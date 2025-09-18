<script setup lang="ts">
import type { ReposDirectory } from '../../../../shared/repos/repos-directory.interface';
import { provideCollapsibleState } from '../../generics/collapsible/use-collapsible-state';
import Icon from '../../generics/icon/icon.vue';

import ReposListDir from './repos-list-dir.vue';
import ReposListRepo from './repos-list-repo.vue';

const props = defineProps<{
  reposDir: ReposDirectory;
}>();

provideCollapsibleState({
  defaultOpen: true,
  storageKey: 'repos-list-collapsibles',
});
</script>

<template>
  <div
    class="repos-list--empty content-flow"
    v-if="props.reposDir.repos.length === 0 && props.reposDir.dirs.length === 0"
  >
    <p class="message-box--warning"><Icon name="alert-fill" /> No repositories found.</p>
    <p class="small--block">Review your <RouterLink to="/settings/repos">Repositories Settings</RouterLink>.</p>
  </div>
  <div class="repos-list" v-else>
    <ReposListRepo v-for="repo in props.reposDir.repos" :key="repo.path" :repo="repo" />
    <ReposListDir v-for="dir in props.reposDir.dirs" :key="dir.path" :repos-dir="dir" />
  </div>
</template>
