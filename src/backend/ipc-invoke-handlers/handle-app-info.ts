import type { IpcMainInvokeEvent } from 'electron/main';

import type { AppInfo } from '../../shared/app-info.interface';
import { getAppInfo } from '../core/app-info';

/**
 * Handle the AppInfo IPC invokation.
 *
 * Returns the application information object.
 *
 * @param _event - The IPC event.
 * @returns The app information.
 */
export async function handleAppInfo(_event: IpcMainInvokeEvent): Promise<AppInfo> {
  return getAppInfo();
}
