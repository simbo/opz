import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';

import { IPC_WINDOW_EVENT_NAME } from '../shared/ipc/ipc-event-name';
import type { IpcWindowCustomEventDetail } from '../shared/ipc/ipc-events.types';
import type { IpcInvokeApi } from '../shared/ipc/ipc-invoke-api.types';
import { IpcInvoke } from '../shared/ipc/ipc-invoke.enum';

/**
 * The IPC Invoke API exposed at `window.ipc` in the renderer process.
 */
contextBridge.exposeInMainWorld(
  'ipc',
  Object.fromEntries(
    Object.values(IpcInvoke).map(channel => [
      channel,
      async (...args: unknown[]) => ipcRenderer.invoke(channel, ...args) as ReturnType<IpcInvokeApi[typeof channel]>,
    ]),
  ) as IpcInvokeApi,
);

/**
 * Dispatch IPC events from the main process as custom DOM events on the window object.
 */
ipcRenderer.on(IPC_WINDOW_EVENT_NAME, (_event: IpcRendererEvent, detail: IpcWindowCustomEventDetail) => {
  window.dispatchEvent(new CustomEvent<IpcWindowCustomEventDetail>(IPC_WINDOW_EVENT_NAME, { detail }));
});
