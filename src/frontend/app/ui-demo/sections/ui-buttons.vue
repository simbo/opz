<script setup lang="ts">
import Icon from '../../generics/icon/icon.vue';
const buttons = ['default', 'primary', 'outline', 'danger', 'invisible'];
</script>

<template>
  <template v-for="button in buttons" :key="button">
    <h3>
      <code>.button--{{ button }}</code>
    </h3>
    <div class="demo-row" v-for="size in ['s', 'm', 'l']" :key="size">
      <button :class="`button--${button} button--${size}`">Button</button>
      <button :class="`button--${button} button--${size}`"><Icon name="mark-github" />Button</button>
      <button :class="`button--${button} button--${size} button--icon-only`">
        <Icon name="mark-github" />
      </button>
      <button :class="`button--${button} button--${size}`" disabled>Button</button>
      <button :class="`button--${button} button--${size}`" disabled><Icon name="mark-github" />Button</button>
      <button :class="`button--${button} button--${size} button--icon-only`" disabled>
        <Icon name="mark-github" />
      </button>
    </div>
  </template>
</template>
