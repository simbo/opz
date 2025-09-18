import { dialog, type IpcMainInvokeEvent } from 'electron/main';

import { setUserSettings, validateUserSettings } from '../user-settings/user-settings';
import { getEventWindow } from '../utils/get-event-window';

/**
 * Handle the ResetUserSettings IPC invokation.
 *
 * Resets all user settings to defaults after user confirmation.
 *
 * @param event - The IPC event.
 * @returns The validated and written UserSettings.
 */
export async function handleResetUserSettings(event: IpcMainInvokeEvent): Promise<void> {
  const win = getEventWindow(event);

  const dialogResult = await dialog.showMessageBox(win, {
    type: 'warning',
    buttons: ['Reset Settings', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
    title: 'Reset Settings',
    message: 'This will reset all settings to defaults.',
    detail: 'Are you sure you want to continue?',
    noLink: true,
  });

  if (dialogResult.response !== 0) {
    return;
  }

  const settings = validateUserSettings({});
  await setUserSettings(settings);
}
