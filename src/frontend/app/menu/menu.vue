<script setup lang="ts">
import MenuButton from './menu-button.vue';
</script>

<template>
  <nav class="menu">
    <div class="menu__group">
      <div class="menu__item">
        <MenuButton to="/repos" icon="repo" label="Repos" />
      </div>
      <div class="menu__item">
        <MenuButton to="/settings" icon="gear" label="Settings" />
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.menu {
  display: flex;
  flex-direction: row;
  gap: 1em;
  justify-content: space-between;
  box-shadow: inset 0 calc(var(--border-width--s) * -1) var(--border-color--default);

  &__group {
    display: flex;
    flex-direction: row;
    gap: 0.25em;
  }
}
</style>
