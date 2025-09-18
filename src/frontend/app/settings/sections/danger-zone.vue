<script setup lang="ts">
import type { Ref } from 'vue';
import { APP_INFO } from '../../core/app-info';
import Icon from '../../generics/icon/icon.vue';
import { watchSettingsSection } from '../watch-settings-section';

const devMode = watchSettingsSection('devMode');

const initialSettings = APP_INFO.initialUserSettings;

interface DangerActionButton {
  type: 'button';
  label?: string;
  action: () => Promise<void> | void;
}

interface DangerActionToggle {
  type: 'toggle';
  model: Ref<boolean>;
}

interface DangerSection {
  label: string;
  description: string;
  actions: (DangerActionButton | DangerActionToggle)[];
}

const dangerSections: DangerSection[] = [
  {
    label: 'Reset Settings',
    description: 'This will reset all your app settings to their defaults.',
    actions: [
      {
        type: 'button',
        action: async () => {
          await window.ipc.resetUserSettings();
        },
      },
    ],
  },
  // {
  //   label: 'Delete App Data',
  //   description: 'This will delete all your app data (and reset all settings to their defaults).',
  //   actions: [
  //     {
  //       type: 'button',
  //       action: () => {
  //         console.log('Delete App Data');
  //       },
  //     },
  //   ],
  // },
  {
    label: 'Developer Mode',
    description: 'Developer Mode enables you to see and break things.<br/>You should know what you are doing.',
    actions: [
      {
        type: 'toggle',
        model: devMode,
      },
    ],
  },
];

const restartApp = async (): Promise<void> => {
  await window.ipc.appRestart();
};
</script>

<template>
  <div class="danger-zone col gap--l">
    <div class="danger-zone__section row gap--xl" v-for="section in dangerSections" :key="section.label">
      <div class="danger-zone__description col gap--xs">
        <label>{{ section.label }}</label>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="small" v-html="section.description"></p>
        <template v-if="section.label === 'Developer Mode' && initialSettings?.devMode !== devMode">
          <div class="message-box--info mt-l">
            <Icon name="info" />
            <div class="content-flow gap--s">
              <p class="small">
                You <strong>{{ devMode ? 'enabled' : 'disabled' }}</strong> Developer Mode.<br />
                The app needs to be restarted to take full effect of this change.
              </p>
              <div>
                <button class="button--primary button--s" @click="restartApp()">Restart Now</button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="danger-zone__actions col gap--m">
        <div class="danger-action" v-for="(action, index) in section.actions" :key="`${section.label}_${index}`">
          <template v-if="action.type === 'toggle'">
            <div class="danger-action__toggle col gap--s">
              <input
                class="danger-action__toggle-input toggle"
                type="checkbox"
                :id="`toggle_${index}`"
                v-model="action.model.value"
              />
            </div>
          </template>
          <button
            class="danger-action__button button--danger"
            @click="action.action"
            v-else-if="action.type === 'button'"
          >
            {{ action.label ?? section.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.danger-zone {
  // max-width: 100%;
  // width: fit-content;
  width: 100%;
  border: var(--border-width--l) solid var(--border-color--danger-muted);
  padding: var(--gap--l);
  border-radius: var(--border-radius--m);

  &__section {
    &:not(:last-child) {
      border-bottom: var(--border-width--m) solid var(--border-color--neutral-muted);
      padding-bottom: var(--gap--l);
    }
  }

  &__description {
    flex: 1 1 auto;
  }

  &__actions {
    flex: 0 0 auto;
  }
}

.danger-action {
  &__toggle {
    align-items: center;
  }
}
</style>
