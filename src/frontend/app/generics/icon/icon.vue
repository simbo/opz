<script setup lang="ts">
import type { IconSize } from '@primer/octicons';
import { ref, watch } from 'vue';
import type { IconName } from './icon.types';
import { loadIcon } from './icons';

const DEFAULT_ICON_COLOR = 'currentColor';
const DEFAULT_ICON_SIZE = 16;

const props = withDefaults(
  defineProps<{
    name: IconName;
    color?: string;
    size?: IconSize;
  }>(),
  {
    color: DEFAULT_ICON_COLOR,
    size: DEFAULT_ICON_SIZE,
  },
);

const iconSvg = ref<string>();

watch(
  () => props.name,
  async name => {
    iconSvg.value = await loadIcon(name, props.size);
  },
  { immediate: true },
);
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html, vue/no-v-text-v-html-on-component-->
  <component class="icon" :is="'span'" v-html="iconSvg ?? ''" v-memo="[iconSvg ?? '']" v-bind="$attrs" />
</template>

<style lang="scss">
.icon {
  display: block;
  width: 1em;
  height: 1em;
  line-height: 1;
  flex: 0 0 auto;

  > svg {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
