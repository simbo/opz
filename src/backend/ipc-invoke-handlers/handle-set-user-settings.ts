import type { IpcMainInvokeEvent } from 'electron/main';
import type { PartialDeep } from 'type-fest';

import type { UserSettings } from '../../shared/user-settings/user-settings.types';
import { mergeIntoUserSettings } from '../user-settings/user-settings';

/**
 * Handle the GetUserSettings IPC invokation.
 *
 * @param _event - The IPC event.
 * @param partial - The new user settings to save (partial or full settings).
 * @returns The validated and written UserSettings.
 */
export async function handleSetUserSettings(
  _event: IpcMainInvokeEvent,
  partial: PartialDeep<UserSettings>,
): Promise<void> {
  await mergeIntoUserSettings(partial);
}
