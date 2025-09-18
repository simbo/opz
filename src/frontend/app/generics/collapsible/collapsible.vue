<script setup lang="ts">
import { computed, ref } from 'vue';

const STRING_RADIX = 36;

const props = withDefaults(
  defineProps<{
    modelValue?: boolean; // optional; if not set → uncontrolled
    id?: string;
    default?: boolean; // only for uncontrolled mode
    disabled?: boolean;
  }>(),
  {
    modelValue: undefined,
    id: Math.random().toString(STRING_RADIX).slice(2),
    default: false,
    disabled: false,
  },
);

const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>();

const fallbackModel = ref<boolean>(props.default);

const open = computed<boolean>({
  get() {
    return props.modelValue ?? fallbackModel.value;
  },
  set(v: boolean) {
    if (props.modelValue === undefined) {
      fallbackModel.value = v;
    } else {
      emit('update:modelValue', v);
    }
  },
});

const baseId = computed(() => `collapsible-${props.id}`);
const triggerId = computed(() => `${baseId.value}-label`);
const panelId = computed(() => `${baseId.value}-panel`);

const toggle = (): void => {
  if (props.disabled) return;
  const next = !open.value;
  open.value = next;
};
</script>

<template>
  <div class="collapsible" :data-open="open ? 'true' : 'false'">
    <button
      class="collapsible__label"
      @click="toggle()"
      type="button"
      :id="triggerId"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="panelId"
      :disabled="!!props.disabled"
    >
      <slot name="label">Summary</slot>
    </button>

    <!-- Panel -->
    <div class="collapsible__panel" role="region" v-if="open" :id="panelId" :aria-labelledby="triggerId">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'mixins';

.collapsible {
  display: flex;
  flex-direction: column;

  &__label {
    display: block;
  }
}
</style>
