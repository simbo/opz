import type { ReadonlyDeep } from 'type-fest';

import type { UserSettings } from './user-settings/user-settings.types';

export interface AppInfo {
  /**
   * The application version.
   */
  version: string;

  /**
   * Whether the application is packaged.
   */
  isPackaged: boolean;

  /**
   * The Electron version.
   */
  electronVersion: string;

  /**
   * The Chrome version.
   */
  chromeVersion: string;

  /**
   * The Node.js version.
   */
  nodeVersion: string;

  /**
   * The V8 version.
   */
  v8Version: string;

  /**
   * The operating system platform.
   */
  platform: NodeJS.Platform;

  /**
   * Whether the operating system is macOS.
   */
  isMacOs: boolean;

  /**
   * The initial user settings at application start.
   */
  initialUserSettings: ReadonlyDeep<UserSettings>;
}
