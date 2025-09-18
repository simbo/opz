import { ref, watch, type Ref } from 'vue';

import type { UserSettings } from '../../../shared/user-settings/user-settings.types';
import { clone } from '../../../shared/utils/clone';
import { saveUserSettings, useUserSettings } from '../core/user-settings-store';

export interface WatchSettingsSectionOptions<K extends keyof UserSettings> {
  onSave?: (settings: UserSettings[K]) => Promise<void> | void;
  onUpdate?: (settings: UserSettings[K]) => Promise<void> | void;
}

/**
 * Provides a reactive reference to a section of the user settings.
 * Watches for changes in the reference and sends them to the main process.
 * Updates the reference when new settings are received from the main process.
 *
 * @param section - The section of the user settings to watch.
 * @param options - Optional callbacks for save and update events.
 * @returns A ref containing the watched section of the user settings.
 */
export function watchSettingsSection<K extends keyof UserSettings>(
  section: K,
  options: WatchSettingsSectionOptions<K> = {},
): Ref<UserSettings[K]> {
  const settingsRef = useUserSettings();

  const sectionSettings = ref(clone(settingsRef.value[section])) as Ref<UserSettings[K]>;

  watch(
    () => JSON.stringify({ [section]: sectionSettings.value }),
    async value => {
      await saveUserSettings(JSON.parse(value) as Partial<UserSettings>);
      if (options.onSave) {
        await options.onSave(JSON.parse(value) as UserSettings[K]);
      }
    },
  );

  watch(
    () => JSON.stringify(settingsRef.value[section]),
    async value => {
      sectionSettings.value = JSON.parse(value) as UserSettings[K];
      if (options.onUpdate) {
        await options.onUpdate(JSON.parse(value) as UserSettings[K]);
      }
    },
  );

  return sectionSettings;
}
