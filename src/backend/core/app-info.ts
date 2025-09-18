import { app } from 'electron/main';

import type { AppInfo } from '../../shared/app-info.interface';
import { deepFreeze } from '../../shared/utils/deep-freeze';
import { getUserSettings } from '../user-settings/user-settings';

const settings = await getUserSettings();

const initialUserSettings = deepFreeze(globalThis.structuredClone(settings));

const APP_INFO: AppInfo = {
  isPackaged: app.isPackaged,
  version: app.getVersion(),
  electronVersion: process.versions.electron,
  chromeVersion: process.versions.chrome,
  nodeVersion: process.versions.node,
  v8Version: process.versions.v8,
  platform: process.platform,
  isMacOs: process.platform === 'darwin',
  initialUserSettings,
};

/**
 * Get the application information.
 *
 * @returns The application information.
 */
export function getAppInfo(): AppInfo {
  return {
    ...APP_INFO,
  };
}
