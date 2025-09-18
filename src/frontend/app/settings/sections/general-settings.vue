<script setup lang="ts">
import type { UserSettings } from '../../../../shared/user-settings/user-settings.types';
import { APP_INFO } from '../../core/app-info';
import { watchSettingsSection } from '../watch-settings-section';
import DangerZone from './danger-zone.vue';

const appearanceSettings = watchSettingsSection('appearance');
const behaviorSettings = watchSettingsSection('behavior');

const themeOptions: { label: string; value: UserSettings['appearance']['theme'] }[] = [
  { label: 'System Default', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];
</script>

<template>
  <div class="content-flow">
    <h1>Settings</h1>
    <hr />

    <h2>General Settings</h2>

    <h3>Appearance</h3>

    <div class="form">
      <div class="fieldset">
        <label for="theme">Color Theme</label>

        <p>Choose between a light or dark color theme, or follow the system setting.</p>

        <select id="theme" v-model="appearanceSettings.theme">
          <option
            v-for="option in themeOptions"
            :key="option.value"
            :value="option.value"
            :selected="option.value === appearanceSettings.theme"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <hr />

    <h3>Behavior</h3>

    <div class="fieldset">
      <label for="quit-on-all-windows-closed">Quit app when all windows are closed</label>

      <p>
        When disabled, the app will stay open even when all windows are closed.<br />
        <em v-if="!APP_INFO.isMacOs">(This option is only available for macOS.)</em>
      </p>

      <input
        class="toggle"
        id="quit-on-all-windows-closed"
        type="checkbox"
        v-model="behaviorSettings.quitOnAllWindowsClosed"
        :disabled="!APP_INFO.isMacOs"
      />
    </div>

    <hr />

    <h3>Danger Zone</h3>
    <DangerZone />
  </div>
</template>
