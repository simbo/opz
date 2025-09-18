import { join } from 'node:path';

import Logger from 'electron-log/main';
import { app, BrowserWindow } from 'electron/main';

import { getUserSettings } from '../user-settings/user-settings';

/**
 * The ID of the main application window.
 */
let mainWindowId: number | undefined;

/**
 * Create the main application window.
 */
export async function createMainWindow(): Promise<void> {
  if (getMainWindow()) {
    return;
  }

  const settings = await getUserSettings();

  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      sandbox: false,
      contextIsolation: true,
      devTools: !app.isPackaged || settings.devMode,
      preload: join(import.meta.dirname, 'preload.js'),
    },
    show: false,
  });

  window.once('ready-to-show', () => {
    window.show();
    window.maximize();
  });

  mainWindowId = window.id;

  (app.isPackaged
    ? window.loadFile(join(import.meta.dirname, `../frontend/${MAIN_WINDOW_VITE_NAME}/index.html`))
    : window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  )
    .catch((error: unknown) => {
      Logger.error(`Error loading frontend resource`, error);
      app.quit();
    })
    .finally(() => {
      Logger.silly('Main window created');
    });
}

/**
 * Get the main application window.
 *
 * @returns The main application window or `undefined` if it is not created yet or closed.
 */
export function getMainWindow(): BrowserWindow | undefined {
  const win = mainWindowId === undefined ? undefined : (BrowserWindow.fromId(mainWindowId) ?? undefined);
  return win?.isDestroyed() ? undefined : win;
}
