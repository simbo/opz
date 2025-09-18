<script setup lang="ts">
import { ref } from 'vue';
import type { IconName } from '../generics/icon/icon.types';
import Icon from '../generics/icon/icon.vue';

const props = withDefaults(
  defineProps<{
    icon?: IconName;
    placeholder?: string;
    defaults?: readonly string[];
    monospace?: boolean;
  }>(),
  {
    icon: undefined,
    placeholder: '',
    defaults: () => [],
    monospace: false,
  },
);

const listModel = defineModel<string[]>({
  type: Array,
  required: true,
});

const entry = ref<string>('');

const addEntry = (): void => {
  if (entry.value && !listModel.value.includes(entry.value)) {
    listModel.value.push(entry.value);
    entry.value = '';
  }
};

const removeEntry = (item: string): void => {
  if (props.defaults.includes(item)) return;
  const index = listModel.value.indexOf(item);
  if (index === -1) return;
  listModel.value.splice(index, 1);
};
</script>

<template>
  <div class="unique-list-control col gap--s">
    <form class="control-bar unique-list-control__add">
      <input
        type="text"
        :class="{ 'unique-list-control__add-input': true, 'control--monospace': monospace }"
        :placeholder="placeholder"
        v-model="entry"
      />

      <button
        class="button--icon-only unique-list-control__add-button"
        @click.prevent="addEntry"
        :disabled="!entry || listModel.includes(entry)"
      >
        <Icon name="plus" />
      </button>
    </form>

    <div class="unique-list-control__list col">
      <div class="unique-list-control__item" v-for="item in listModel" :key="item">
        <button
          @click="removeEntry(item)"
          :class="{
            'unique-list-control__label': true,
            'unique-list-control__label--monospace': monospace,
            row: true,
            'gap--s': true,
          }"
          :disabled="defaults.includes(item)"
        >
          <Icon class="unique-list-control__icon" v-if="icon" :name="icon" />
          <div class="unique-list-control__text">{{ item }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'mixins';

.unique-list-control {
  display: inline-flex;
  align-items: stretch;

  &__add {
    &-input {
      flex: 1 1 auto;
    }
  }

  &__list {
    min-width: 100%;
    width: fit-content;
    border: var(--border-width--s) solid var(--border-color--default);
    border-radius: var(--border-radius--m);
    background: var(--bg-color--muted);
    padding: var(--gap--xs);
  }

  &__item {
    width: 100%;
  }

  &__icon {
    color: var(--color--muted);
  }

  &__label {
    width: 100%;
    padding: var(--gap--xs);
    border-radius: var(--border-radius--m);

    &:focus-visible:not(:disabled),
    &:hover:not(:disabled) {
      position: relative;
      color: var(--color--danger);
      text-decoration: line-through;
      background: var(--bg-color--neutral-muted);

      > .unique-list-control__icon {
        color: var(--color--danger);
      }
    }

    &:disabled {
      color: var(--color--disabled);
    }
  }

  &__text {
    @include mixins.ellipsis;
    margin-right: var(--gap--s);
  }
}
</style>
