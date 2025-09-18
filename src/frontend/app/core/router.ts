import { createRouter, createWebHashHistory } from 'vue-router';

import { getScrollParent, MAIN_SCROLL_OFFSET } from '../utils/scrolling';

export const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return false;
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      children: [
        {
          path: '',
          redirect: '/repos',
        },
        {
          path: 'repos',
          component: async () => import('../repos/repos-view.vue'),
        },
        {
          path: 'settings',
          component: async () => import('../settings/settings-view.vue'),
          children: [
            { path: '', redirect: '/settings/general' },
            { path: 'general', component: async () => import('../settings/sections/general-settings.vue') },
            { path: 'repos', component: async () => import('../settings/sections/repos-settings.vue') },
            { path: 'about', component: async () => import('../settings/sections/about.vue') },
          ],
        },
        {
          path: 'ui-demo',
          component: async () => import('../ui-demo/ui-demo.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: async () => import('../not-found-view.vue') },
  ],
});

// Handle in-page hash navigation with a smooth scroll.
router.afterEach(to => {
  if (!to.hash) return;
  // Wait a frame so the DOM is updated/rendered.
  window.requestAnimationFrame(() => {
    const el = window.document.querySelector<HTMLElement>(to.hash);
    if (!el) return;
    getScrollParent(el).scrollTo({ top: el.offsetTop - MAIN_SCROLL_OFFSET, behavior: 'smooth' });
  });
});
