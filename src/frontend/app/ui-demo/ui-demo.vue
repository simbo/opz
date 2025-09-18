<script setup lang="ts">
import { type Component, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

import type { IconName } from '../generics/icon/icon.types';
import Icon from '../generics/icon/icon.vue';

import { observeAnchorInViewport } from '../utils/observe-anchor-in-viewport';
import UiButtons from './sections/ui-buttons.vue';
import UiContentFlow from './sections/ui-content-flow.vue';
import UiControlBars from './sections/ui-control-bars.vue';
import UiControls from './sections/ui-controls.vue';
import UiLists from './sections/ui-lists.vue';
import UiMessages from './sections/ui-messages.vue';
import UiTypo from './sections/ui-typo.vue';

interface Section {
  name: string;
  icon: IconName;
  component: Component;
  id: string;
}

const SECTIONS: Omit<Section, 'id'>[] = [
  {
    name: 'Typography',
    icon: 'typography',
    component: UiTypo,
  },
  {
    name: 'Content Flow',
    icon: 'rows',
    component: UiContentFlow,
  },
  {
    name: 'Lists',
    icon: 'list-unordered',
    component: UiLists,
  },
  {
    name: 'Messages',
    icon: 'note',
    component: UiMessages,
  },
  {
    name: 'Buttons',
    icon: 'square-fill',
    component: UiButtons,
  },
  {
    name: 'Controls',
    icon: 'terminal',
    component: UiControls,
  },
  {
    name: 'Control Bars',
    icon: 'ellipsis',
    component: UiControlBars,
  },
];

const sections = SECTIONS.map<Section>(section => ({
  ...section,
  id: `heading__${section.name.toLowerCase().replaceAll(/\W+/g, '')}`,
}));

const { activeAnchorId, startObserving, destroyAnchorObserver } = observeAnchorInViewport();

const pageRef = ref<HTMLElement>();

onMounted(async () => {
  await nextTick();
  startObserving([...(pageRef.value?.querySelectorAll<HTMLElement>('[id^="heading__"]') ?? [])]);
});

onBeforeUnmount(() => {
  destroyAnchorObserver();
});
</script>

<template>
  <div class="page" ref="pageRef">
    <div class="page__sidebar">
      <div class="toc-menu">
        <div class="toc-menu__item" v-for="section in sections" :key="section.id">
          <RouterLink
            :class="{ 'toc-menu__link': true, 'toc-menu__link--active': activeAnchorId === section.id }"
            :to="{ hash: `#${section.id}` }"
          >
            <Icon class="toc-menu__icon" :name="section.icon" :size="24" />
            <div class="toc-menu__label">{{ section.name }}</div>
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="page__content content-flow">
      <h1>UI Demo</h1>
      <hr />

      <p>
        This view is using a <code>.page</code> container with optional <code>.page__sidebar</code> and
        <code>.page__content</code> columns.
      </p>
      <p>Sidebar navigation is done using <code>.toc-menu</code> and <code>observeAnchorInViewport()</code></p>
      <p>The vertical rhythm of this container is controlled by <code>.content-flow</code>.</p>
      <p class="small muted">
        Use <code>.content-flow</code> with <code>.gap-xs</code>, <code>.gap-s</code>, <code>.gap-m</code>,
        <code>.gap-l</code>, or <code>.gap-xl</code> to change the vertical spacing between elements.
      </p>

      <template v-for="section in sections" :key="section.id">
        <hr />
        <h2 :id="section.id">{{ section.name }}</h2>
        <component :is="section.component" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.demo-row) {
  > *:not(:last-child) {
    margin-right: var(--gap--m);
  }
}
</style>
