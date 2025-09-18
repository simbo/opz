import { readFile, writeFile } from 'node:fs/promises';

import { createValidationFunction } from '@simbo/zodpak';
import Logger from 'electron-log/main';
import type { PartialDeep } from 'type-fest';

import { IpcEventType } from '../../shared/ipc/ipc-event-type.enum';
import type { UserSettings } from '../../shared/user-settings/user-settings.types';
import { deepFreeze } from '../../shared/utils/deep-freeze';
import { emitIpcEvent } from '../core/emit-ipc-event';
import { emitter } from '../emitter/emitter';
import { EmitterEvent } from '../emitter/emitter-event.enum';

import { USER_SETTINGS_FILE_PATH } from './user-settings-constants';
import { userSettingsSchema } from './user-settings-schema';

let CACHE: UserSettings | undefined;

/**
 * Validates user settings.
 *
 * @param data - The data to validate.
 * @returns The validated user settings with defaults applied.
 * @throws {ValidationError} If the data is not valid according to the schema.
 */
export const validateUserSettings = createValidationFunction(userSettingsSchema);

/**
 * Gets the current user settings.
 *
 * @returns The current user settings.
 */
export async function getUserSettings(): Promise<UserSettings> {
  if (!CACHE) {
    await updateUserSettings();
  }
  return CACHE as UserSettings;
}

/**
 * Sets the user settings.
 *
 * @param settings - The user settings to set.
 */
export async function setUserSettings(settings: UserSettings): Promise<void> {
  settings = validateUserSettings(settings);
  if (userSettingsChanged(settings, CACHE)) {
    await writeUserSettings(settings);
    await updateUserSettings(settings);
  }
}

/**
 * Merges the provided partial user settings with the current user settings and
 * sets the result as the new user settings.
 *
 * @param partial - The partial user settings to merge.
 * @returns The merged user settings.
 */
export async function mergeIntoUserSettings(partial: PartialDeep<UserSettings>): Promise<void> {
  const settings = mergeUserSettings(partial, CACHE ?? (await readUserSettings()));
  return setUserSettings(settings);
}

/**
 * Subscribes to user settings updates.
 *
 * @param listener - The listener function to call when settings are updated.
 * @returns An object with an unsubscribe method to remove the listener.
 */
export function subscribeToUserSettings(listener: (settings: UserSettings) => Promise<void> | void): {
  unsubscribe: () => void;
} {
  emitter.on(EmitterEvent.UserSettingsUpdated, listener);
  return {
    unsubscribe: () => {
      emitter.off(EmitterEvent.UserSettingsUpdated, listener);
    },
  };
}

/**
 * Updates the user settings cache.
 * If no settings are provided, the current settings are read from disk.
 * Emits the settings updated event after updating the cache.
 *
 * @param settings - The user settings to update the cache with (optional).
 */
async function updateUserSettings(settings?: UserSettings): Promise<void> {
  CACHE = settings ?? (await readUserSettings());
  emitter.emit(EmitterEvent.UserSettingsUpdated, CACHE).catch((error: unknown) => {
    Logger.error(`Error during ${EmitterEvent.UserSettingsUpdated} event:`, error);
  });
  emitIpcEvent(IpcEventType.UserSettingsChanged, deepFreeze(CACHE));
}

/**
 * Merges and validates partial user settings with base user settings.
 *
 * @param partial - The partial user settings to merge.
 * @param base - The base user settings to merge with.
 * @returns The merged user settings.
 */
function mergeUserSettings(partial: PartialDeep<UserSettings>, base: UserSettings): UserSettings {
  return {
    appearance: {
      theme: partial.appearance?.theme ?? base.appearance.theme,
    },
    behavior: {
      quitOnAllWindowsClosed: partial.behavior?.quitOnAllWindowsClosed ?? base.behavior.quitOnAllWindowsClosed,
    },
    devMode: partial.devMode ?? base.devMode,
    reposScan: {
      maxDepth: partial.reposScan?.maxDepth ?? base.reposScan.maxDepth,
      ignoreList: [...new Set(partial.reposScan?.ignoreList ?? base.reposScan.ignoreList)],
      basePaths: [...new Set(partial.reposScan?.basePaths ?? base.reposScan.basePaths)],
    },
  };
}

/**
 * Writes the user settings to disk.
 *
 * @param settings - The user settings to write to disk.
 */
async function writeUserSettings(settings: UserSettings): Promise<void> {
  const str = JSON.stringify(settings);
  await writeFile(USER_SETTINGS_FILE_PATH, str, 'utf8');
}

/**
 * Reads and validates user settings from disk or return defaults if the file does not exist.
 *
 * @returns The validated user settings read from disk.
 * @throws {ValidationError} If the settings file is not valid.
 * @throws {Error} If there is an error reading the file other than file not found.
 */
async function readUserSettings(): Promise<UserSettings> {
  let str: string;
  try {
    str = await readFile(USER_SETTINGS_FILE_PATH, 'utf8');
  } catch (error) {
    if (typeof error === 'object' && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      str = '{}';
    } else {
      throw error;
    }
  }
  return validateUserSettings(JSON.parse(str));
}

/**
 * Checks if two user settings objects are different.
 *
 * @param a - previous settings
 * @param b - next settings
 * @returns True if the settings are different, false otherwise.
 */
function userSettingsChanged(a?: UserSettings, b?: UserSettings): boolean {
  return (a && JSON.stringify(a)) !== (b && JSON.stringify(b));
}
