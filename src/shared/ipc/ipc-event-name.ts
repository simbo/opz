/**
 * The internal name for IPC events.
 *
 * In the main process, this is used as the channel name for
 * `window.webContents.send` to send messages to the renderer processes.
 * The preload script listens for these event names and re-dispatches them, by
 * emitting CustomEvents on the window object that the application code in the
 * renderer process can listen to.
 */
export const IPC_WINDOW_EVENT_NAME = 'ipc-window-event';
