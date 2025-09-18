<script setup lang="ts">
import Footer from './footer/footer.vue';
import Menu from './menu/menu.vue';
</script>
<template>
  <div class="app-layout">
    <header class="app-layout__header"><Menu /></header>
    <main class="app-layout__main"><slot /></main>
    <footer class="app-layout__footer"><Footer /></footer>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    flex: 0 0 auto;
    background-color: var(--bg-color--muted);
  }

  &__main {
    flex: 1 1 auto;
    overflow: auto;
    background-color: var(--bg-color--default);
  }

  &__footer {
    flex: 0 0 auto;
    background-color: var(--bg-color--muted);
  }
}
</style>
