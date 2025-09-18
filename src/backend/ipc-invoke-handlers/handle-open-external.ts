import { shell } from 'electron/common';
import type { IpcMainInvokeEvent } from 'electron/main';

/**
 * Handle the OpenExternal IPC invokation.
 *
 * Opens the given URL in the default external application.
 *
 * @param _event - The IPC event.
 * @param url - The URL to open.
 */
export async function handleOpenExternal(_event: IpcMainInvokeEvent, url: string): Promise<void> {
  await shell.openExternal(url);
}
