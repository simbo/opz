import type { IpcMainInvokeEvent } from 'electron/main';
import type { ReadonlyDeep } from 'type-fest';

import type { UserSettings } from '../../shared/user-settings/user-settings.types';
import { deepFreeze } from '../../shared/utils/deep-freeze';
import { getUserSettings } from '../user-settings/user-settings';

/**
 * Handle the GetUserSettings IPC invokation.
 *
 * Returns the current user settings as read-only, deep frozen object.
 *
 * @param _event - The IPC event.
 * @returns The UserSettings.
 */
export async function handleGetUserSettings(_event: IpcMainInvokeEvent): Promise<ReadonlyDeep<UserSettings>> {
  const settings = await getUserSettings();
  return deepFreeze(settings);
}
