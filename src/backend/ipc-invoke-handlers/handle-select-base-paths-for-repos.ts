import { dialog, type IpcMainInvokeEvent } from 'electron/main';

import { getEventWindow } from '../utils/get-event-window';

/**
 * Handle the SelectBasePathsForRepos IPC invokation.
 *
 * Opens a dialog to select one or more base paths for repositories.
 *
 * @param event - The IPC event.
 * @returns The selected base paths.
 */
export async function handleSelectBasePathsForRepos(event: IpcMainInvokeEvent): Promise<string[]> {
  const win = getEventWindow(event);

  const result = await dialog.showOpenDialog(win, {
    title: 'Select Base Paths for Repositories',
    message: 'Select one or more base paths where your repositories are located.',
    buttonLabel: 'Select',
    properties: ['openDirectory', 'multiSelections', 'dontAddToRecent'],
  });

  return !result.canceled && result.filePaths.length > 0 ? [...result.filePaths] : [];
}
