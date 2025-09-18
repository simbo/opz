<script setup lang="ts">
import type { SetOptional } from 'type-fest';
import { useRoute } from 'vue-router';
import type { IconName } from '../generics/icon/icon.types';
import Icon from '../generics/icon/icon.vue';
import { SvgIcon } from '../generics/icon/svg-icon.enum';

type MenuItem = MenuLink | MenuDivider;

interface MenuLink {
  name: string;
  icon: IconName;
  path: string;
}

interface MenuDivider {
  type: 'divider';
  name: string;
}

const SETTINGS_MENU: (SetOptional<MenuLink, 'path'> | SetOptional<MenuDivider, 'name'>)[] = [
  {
    name: 'General',
    icon: 'briefcase',
  },
  {
    name: 'Repositories',
    path: 'repos',
    icon: 'repo',
  },
  { type: 'divider' },
  {
    name: 'About',
    icon: SvgIcon.Opz,
  },
];

const route = useRoute();

const settingsMenu: MenuItem[] = SETTINGS_MENU.map((item, index) =>
  'type' in item
    ? { ...item, name: `divider-${index}` }
    : { ...item, path: `/settings/${item.path ?? item.name.toLowerCase()}` },
);
</script>

<template>
  <div class="toc-menu">
    <template v-for="item in settingsMenu" :key="item.name">
      <div class="toc-menu__divider" v-if="'type' in item"></div>
      <div class="toc-menu__item" v-else>
        <RouterLink
          :class="{ 'toc-menu__link': true, 'toc-menu__link--active': route.path === item.path }"
          :to="item.path"
        >
          <Icon class="toc-menu__icon" :name="item.icon" :size="24" />
          <div class="toc-menu__label">{{ item.name }}</div>
        </RouterLink>
      </div>
    </template>
  </div>
</template>
