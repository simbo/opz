<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserSettings } from '../core/user-settings-store';
import Icon from '../generics/icon/icon.vue';

const route = useRoute();

const settingsRef = useUserSettings();

const devMode = computed(() => settingsRef.value.devMode);
</script>

<template>
  <div class="footer">
    <div class="current-route" v-if="devMode">
      <Icon name="file" />
      {{ route.fullPath }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  padding: 0.5rem;
  border-top: var(--border-width--s) solid var(--border-color--default);
  background-color: var(--bg-color--muted);
  color: var(--color--muted);
  font-size: 0.75em;
}

.current-route {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
</style>
