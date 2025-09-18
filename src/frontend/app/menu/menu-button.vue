<script setup lang="ts">
import type { IconName } from '../generics/icon/icon.types';
import Icon from '../generics/icon/icon.vue';

defineProps<{
  to: string;
  icon: IconName;
  label: string;
}>();
</script>

<template>
  <router-link class="menu-btn" :to="to">
    <div class="menu-btn__inner">
      <div class="menu-btn__icon"><Icon :name="icon" :size="24" /></div>
      <div class="menu-btn__label">{{ label }}</div>
    </div>
  </router-link>
</template>

<style lang="scss">
@use 'sass:math';
@use 'mixins';

.menu-btn {
  display: block;
  padding: 0;
  color: var(--color--muted);
  text-decoration: none;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25em;
    width: 3.75em;
    height: 3.75em;
    padding: 0.25em 0;
  }

  &:hover &__inner {
    color: var(--color--default);
    background-color: var(--bg-color--neutral-muted);
  }

  &__icon {
    text-align: center;
    font-size: (math.div(20, 14) * 1em);
  }

  &__label {
    @include mixins.ellipsis;
    font-size: 0.625em;
    text-align: center;
    width: 100%;
  }

  &.router-link-active {
    box-shadow: inset 0 -1px var(--color--accent);
  }

  &.router-link-active &__inner {
    color: var(--color--default);
  }
}
</style>
