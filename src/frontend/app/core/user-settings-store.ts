import Logger from 'electron-log/renderer';
import type { PartialDeep, ReadonlyDeep } from 'type-fest';
import { inject, shallowRef, type InjectionKey, type ObjectPlugin, type ShallowRef } from 'vue';

import { IpcEventType } from '../../../shared/ipc/ipc-event-type.enum';
import type { UserSettings } from '../../../shared/user-settings/user-settings.types';
import { clone } from '../../../shared/utils/clone';

import { onIpcEvent } from './on-ipc-event';

/**
 * The interface for the user settings store.
 */
export interface UserSettingsStore extends ObjectPlugin {
  /**
   * The install function for the plugin to provide the user settings on app level.
   */
  install: ObjectPlugin['install'];

  /**
   * The current user settings.
   * In the frontend, the user settings are provided as a readonly, frozen object.
   */
  settings: ReadonlyDeep<UserSettings>;

  /**
   * The `ref` is a shallowRef that can be used to reactively track changes
   * to the settings. It is provided via Vue's provide/inject mechanism and can be
   * used in components via the `useUserSettings` function.
   */
  ref: ShallowRef<ReadonlyDeep<UserSettings>>;

  /**
   * Subscribe to user settings changes.
   *
   * @param listener - The listener function that is called when the user settings change.
   * @returns An object with an `unsubscribe` function to remove the listener.
   */
  subscribe: (listener: (settings: ReadonlyDeep<UserSettings>) => Promise<void> | void) => { unsubscribe: () => void };
}

/**
 * The injection key for the user settings ref.
 */
const PROVIDER_KEY: InjectionKey<UserSettingsStore['ref']> = Symbol('UserSettingsRef');

/**
 * The user settings store.
 */
export const userSettingsStore = await createUserSettingsStore();

/**
 * Use the user settings store.
 *
 * @throws {Error} If there is no matching provider.
 * @returns The user settings store.
 */
export function useUserSettings(): UserSettingsStore['ref'] {
  const ref = inject(PROVIDER_KEY);
  if (!ref) {
    throw new Error('useUserSettings() called without a matching provider');
  }
  return ref;
}

/**
 * Save partial user settings by merging them into current settings.
 *
 * This is sent to the main process via IPC to be persisted.
 * Updates to the settings will be sent back via the UserSettingsChanged event.
 *
 * @param partial - The partial user settings to store.
 */
export async function saveUserSettings(partial: PartialDeep<UserSettings>): Promise<void> {
  try {
    await window.ipc.setUserSettings(clone(partial));
  } catch (error: unknown) {
    Logger.error('Failed to set user settings', error);
  }
}

/**
 * Creates the user settings store.
 *
 * @returns The user settings store.
 */
async function createUserSettingsStore(): Promise<UserSettingsStore> {
  const value = await window.ipc.getUserSettings();

  const store: UserSettingsStore = {
    settings: value,
    ref: shallowRef(value),
    install: app => {
      app.provide(PROVIDER_KEY, store.ref);
    },
    subscribe: listener => {
      const { unsubscribe } = onIpcEvent<ReadonlyDeep<UserSettings>>(
        IpcEventType.UserSettingsChanged,
        async settings => {
          if (settings) await listener(settings);
        },
      );
      return { unsubscribe };
    },
  };

  store.subscribe(settings => {
    store.settings = settings;
    store.ref.value = settings;
  });

  return store;
}
