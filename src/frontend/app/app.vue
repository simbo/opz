<script setup lang="ts">
import Logger from 'electron-log/renderer';
import { onMounted, watch } from 'vue';
import type { IpcEventSubscription } from '../../shared/ipc/ipc-events.types';
import AppLayout from './app-layout.vue';
import { onIpcEvent } from './core/on-ipc-event';
import { useUserSettings } from './core/user-settings-store';
import { getWindowMenuEventHandlers } from './core/window-menu-events';

const settingsRef = useUserSettings();

onMounted(() => {
  Logger.silly('App mounted');
});

/**
 * Set the color theme based on the user settings.
 */
watch(
  () => settingsRef.value.appearance.theme,
  themeValue => {
    window.document.documentElement.dataset.colorTheme = themeValue;
  },
  { immediate: true },
);

/**
 * Set up IPC event handlers for window menu actions.
 */
const windowMenuSubscriptions: IpcEventSubscription[] = [];

watch(
  () => settingsRef.value.devMode,
  devMode => {
    for (const sub of windowMenuSubscriptions) {
      sub.unsubscribe();
    }
    windowMenuSubscriptions.length = 0;
    for (const [event, handler] of getWindowMenuEventHandlers(devMode)) {
      const sub = onIpcEvent(event, handler);
      windowMenuSubscriptions.push(sub);
    }
  },
  { immediate: true },
);
</script>

<template>
  <AppLayout><router-view /></AppLayout>
</template>
