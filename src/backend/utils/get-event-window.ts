import { BrowserWindow, type IpcMainInvokeEvent } from 'electron/main';

import { getMainWindow } from '../core/main-window';

/**
 * Get the BrowserWindow associated with the given IPC event.
 *
 * If no window is associated, return the currently focused window,
 * or the main application window as a fallback.
 *
 * @param event - The IPC event.
 * @returns The associated BrowserWindow.
 */
export function getEventWindow(event: IpcMainInvokeEvent): BrowserWindow {
  const win = BrowserWindow.fromWebContents(event.sender) ?? BrowserWindow.getFocusedWindow() ?? getMainWindow();
  if (!win || win.isDestroyed()) {
    throw new Error('No valid window associated with the IPC event');
  }
  return win;
}
