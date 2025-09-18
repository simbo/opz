import { join } from 'node:path';
import { cwd } from 'node:process';

import Logger from 'electron-log/main';
import { app } from 'electron/main';

/**
 * Log file name, directory, and path.
 */
const LOG_FILE = `${app.name}.log`;
const LOG_DIR = app.isPackaged ? app.getPath('userData') : cwd();
const LOG_PATH = join(LOG_DIR, LOG_FILE);

/**
 * Log levels for file and console transports.
 */
const LOG_LEVEL_FILE = 'info';
const LOG_LEVEL_CONSOLE = app.isPackaged ? 'info' : 'silly';

/**
 * Initialize the logger for the main process.
 *
 * This should be called once during app initialization.
 */
export function initializeLogger(): void {
  Logger.transports.file.fileName = LOG_FILE;
  Logger.transports.file.resolvePathFn = () => LOG_PATH;
  Logger.transports.file.level = LOG_LEVEL_FILE;

  Logger.transports.console.level = LOG_LEVEL_CONSOLE;

  Logger.initialize();
}
