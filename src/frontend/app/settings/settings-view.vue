<script setup lang="ts">
import SettingsMenu from './settings-menu.vue';
</script>

<template>
  <div class="page">
    <div class="page__sidebar">
      <SettingsMenu />
    </div>
    <div class="page__content">
      <router-view />
    </div>
  </div>
</template>
