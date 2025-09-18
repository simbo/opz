import Logger from 'electron-log/main';
import { app, ipcMain, type IpcMainInvokeEvent } from 'electron/main';

import { getAppInfo } from './core/app-info';
import { initializeAppMenu } from './core/app-menu';
import { setContentSecurityPolicyHeader } from './core/content-security-policy';
import { initializeLogger } from './core/logger';
import { createMainWindow, getMainWindow } from './core/main-window';
import { ipcInvokeHandlers } from './ipc-invoke-handlers/ipc-invoke-handlers';
import { getUserSettings } from './user-settings/user-settings';
import { isMacOs } from './utils/is-mac-os';

// Initialize logging first.
initializeLogger();
Logger.silly('Backend starting');

// AppInfo must be requested initially to store initial user settings.
const appInfo = getAppInfo();
Logger.silly('AppInfo', { ...appInfo });

// Close the app when all windows are closed.
app.on('window-all-closed', () => {
  (async () => {
    const settings = await getUserSettings();
    if (isMacOs() && !settings.behavior.quitOnAllWindowsClosed) {
      return;
    }
    app.quit();
  })().catch((error: unknown) => {
    Logger.error('Error during window-all-closed handling', error);
  });
});

// When the app is ready,...
app.on('ready', () => {
  // Set up Content Security Policy (CSP) headers.
  setContentSecurityPolicyHeader();

  // Hook-up IPC invoke handlers.
  for (const [channel, handler] of Object.entries(ipcInvokeHandlers)) {
    ipcMain.handle(channel, async (event, ...args: unknown[]) => {
      Logger.silly(`IPC invoke ${channel}`, ...args);
      return await (handler as (event: IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown>)(event, ...args);
    });
  }

  (async () => {
    // Initialize the application menu.
    await initializeAppMenu();

    // Create the main application window.
    await createMainWindow();

    // When the app is activated (e.g. clicking the dock icon on macOS), recreate
    // the main window if there are no other windows open.
    app.on('activate', () => {
      (async () => {
        if (!getMainWindow()) {
          await createMainWindow();
        }
      })().catch((error: unknown) => {
        Logger.error('Error during app activation', error);
      });
    });

    Logger.silly('Backend ready');
  })().catch((error: unknown) => {
    Logger.error('Error during app initialization', error);
  });
});
