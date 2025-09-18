<script setup lang="ts">
import type { Repo } from '../../../../shared/repos/repo.interface';
import Icon from '../../generics/icon/icon.vue';

defineProps<{
  repo: Repo;
}>();
</script>

<template>
  <div class="repos-list__item--repo">
    <div class="repos-list__label">
      <Icon name="repo" />
      <div class="repos-list__name">{{ repo.basename }}</div>
    </div>
  </div>
</template>
