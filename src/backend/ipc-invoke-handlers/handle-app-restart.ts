import Logger from 'electron-log/main';
import { app, type IpcMainInvokeEvent } from 'electron/main';

/**
 * Handle the AppRestart IPC invokation.
 *
 * Restarts the application.
 *
 * @param _event - The IPC event.
 */
export async function handleAppRestart(_event: IpcMainInvokeEvent): Promise<void> {
  // Restart the app asynchronously to allow the IPC response to be sent back to the renderer process.
  (async () => {
    app.relaunch();
    app.exit();
  })().catch((error: unknown) => {
    Logger.error('Error during app restart:', error);
  });
}
