import './index.scss';

import Logger from 'electron-log/renderer';
import { createApp } from 'vue';

import App from './app/app.vue';
import { pinia } from './app/core/pinia';
import { router } from './app/core/router';
import { userSettingsStore } from './app/core/user-settings-store';

const app = createApp(App);

app.use(userSettingsStore);
app.use(pinia);
app.use(router);

app.mount('#app');

// Hello from frontend.
Logger.silly('Frontend ready');
