<script setup lang="ts">
import Icon from '../../generics/icon/icon.vue';
</script>

<template>
  <h3>Control Bars</h3>

  <div class="control-bar">
    <input type="text" placeholder="Enter text..." />
    <button class="button">Go!</button>
  </div>

  <div class="control-bar">
    <button class="button--icon-only"><Icon name="bold" /></button>
    <button class="button--icon-only"><Icon name="italic" /></button>
    <button class="button--icon-only"><Icon name="strikethrough" /></button>
    <button class="button--icon-only"><Icon name="list-ordered" /></button>
    <button class="button--icon-only"><Icon name="list-unordered" /></button>
    <button class="button--icon-only"><Icon name="link" /></button>
  </div>

  <div class="control-bar">
    <button class="button--icon-only"><Icon name="bold" /></button>
    <button class="button--icon-only button--primary"><Icon name="italic" /></button>
    <button class="button--icon-only button--outline"><Icon name="strikethrough" /></button>
    <button class="button--icon-only button--danger"><Icon name="list-ordered" /></button>
    <button class="button--icon-only button--invisible"><Icon name="list-unordered" /></button>
    <button class="button--icon-only"><Icon name="link" /></button>
  </div>
</template>
