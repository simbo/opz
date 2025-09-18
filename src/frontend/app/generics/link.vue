<script setup lang="ts">
import Logger from 'electron-log/renderer';

const props = defineProps<{
  href: string;
}>();

const open = (url: string): void => {
  window.ipc.openExternal(url).catch((error: unknown) => {
    Logger.error('Failed to open external link:', error);
  });
};
</script>

<template>
  <a @click.prevent="open(props.href)" :href="props.href" v-bind="$attrs">
    <slot />
  </a>
</template>
