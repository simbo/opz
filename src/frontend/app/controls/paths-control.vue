<script setup lang="ts">
import Icon from '../generics/icon/icon.vue';

const pathsModel = defineModel<string[]>({
  type: Array,
  required: true,
});

const addPaths = async (): Promise<void> => {
  const morePaths = await window.ipc.selectBasePathsForRepos();
  pathsModel.value = [...new Set([...pathsModel.value, ...morePaths])];
};

const removePath = async (path: string): Promise<void> => {
  if (pathsModel.value.length === 1) {
    return;
  }
  const paths = new Set(pathsModel.value);
  paths.delete(path);
  pathsModel.value = [...paths];
};
</script>

<template>
  <div class="paths-control col gap--s">
    <button class="button paths-control__add" @click="addPaths">Add Path(s)</button>

    <div class="paths-control__list col gap--xs">
      <div class="paths-control__item row gap" v-for="path in pathsModel" :key="path">
        <Icon class="paths-control__icon" :name="'file-directory-open-fill'" />
        <div class="paths-control__label code ellipsis">{{ path }}</div>
        <button
          class="button--danger button--s paths-control__remove"
          @click="removePath(path)"
          :disabled="pathsModel.length === 1"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'mixins';

.paths-control {
  display: inline-flex;

  &__add {
    align-self: flex-start;
  }

  &__list {
    width: fit-content;
    border: var(--border-width--s) solid var(--border-color--default);
    border-radius: var(--border-radius--m);
    background: var(--bg-color--muted);
    padding: var(--gap--xs) var(--gap--xs) var(--gap--xs) var(--gap--m);
  }

  &__item {
    width: 100%;
  }

  &__icon {
    color: var(--color--muted);
  }

  &__label {
    @include mixins.ellipsis;
    flex: 0 1 auto;
    margin-right: 1em;
  }

  &__remove {
    flex: 0 0 auto;
    margin-left: auto;
  }
}
</style>
