import Logger from 'electron-log/main';

import { IPC_WINDOW_EVENT_NAME } from '../../shared/ipc/ipc-event-name';
import type { IpcEventType } from '../../shared/ipc/ipc-event-type.enum';
import type { IpcWindowCustomEventDetail } from '../../shared/ipc/ipc-events.types';

import { getMainWindow } from './main-window';

/**
 * Emit an IPC event to the renderer process.
 *
 * @param type - The IPC event type to emit.
 * @param payload - The optional payload to send with the event.
 */
export function emitIpcEvent(type: IpcEventType, payload?: unknown): void {
  const mainWindow = getMainWindow();

  if (!mainWindow) {
    return;
  }

  Logger.silly(`IPC event ${type}`, ...(payload ? [payload] : []));

  mainWindow.webContents.send(IPC_WINDOW_EVENT_NAME, { type, payload } satisfies IpcWindowCustomEventDetail);
}
