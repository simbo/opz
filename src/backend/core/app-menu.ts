import { app, Menu, type MenuItemConstructorOptions } from 'electron/main';

import { IpcEventType } from '../../shared/ipc/ipc-event-type.enum';
import { getUserSettings, subscribeToUserSettings } from '../user-settings/user-settings';

import { emitIpcEvent } from './emit-ipc-event';
import { getMainWindow } from './main-window';

/**
 * Initializes the application menu.
 */
export async function initializeAppMenu(): Promise<void> {
  await setAppMenu();

  // Update the app menu when dev mode setting changes.
  subscribeToUserSettings(setAppMenu);
}

/**
 * Generates the application menu options based on the platform and user settings.
 *
 * @returns The menu item constructor options for the application menu.
 */
async function getAppMenuOptions(): Promise<MenuItemConstructorOptions[]> {
  const settings = await getUserSettings();
  const isMac = process.platform === 'darwin';

  const devMenu: MenuItemConstructorOptions[] = settings.devMode
    ? [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        {
          label: 'UI Elements',
          accelerator: 'CmdOrCtrl+U',
          click: () => {
            emitIpcEvent(IpcEventType.MenuClickUiDemo);
          },
        },
        { type: 'separator' },
      ]
    : [];

  const appMenu: MenuItemConstructorOptions[] = [
    {
      label: isMac ? app.name : 'File',
      submenu: [
        {
          label: 'About',
          click: () => {
            emitIpcEvent(IpcEventType.MenuClickAbout);
          },
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            emitIpcEvent(IpcEventType.MenuClickSettings);
          },
        },
        { type: 'separator' },
        { role: 'quit', label: 'Exit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        ...devMenu,
        { role: 'minimize' },
        {
          label: 'Maximize',
          click: () => {
            getMainWindow()?.maximize();
          },
          accelerator: 'CmdOrCtrl+Shift+F',
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];

  return appMenu;
}

/**
 * Set the main application window menu based on user settings.
 */
async function setAppMenu(): Promise<void> {
  const options = await getAppMenuOptions();
  const menu = Menu.buildFromTemplate(options);
  Menu.setApplicationMenu(menu);
}
