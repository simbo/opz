import { join } from 'node:path';
import { cwd } from 'node:process';

import { app } from 'electron/main';

/**
 * The user settings file name.
 */
export const USER_SETTINGS_FILE_NAME = 'user-settings.json';

/**
 * The full path to the user settings file.
 */
export const USER_SETTINGS_FILE_PATH = join(app.isPackaged ? app.getPath('userData') : cwd(), USER_SETTINGS_FILE_NAME);
