import { IpcEventType } from '../../../shared/ipc/ipc-event-type.enum';

import { router } from './router';

/**
 * Get the window menu event handlers.
 *
 * @param devMode - Whether dev mode is enabled.
 * @returns A map of window menu event handlers.
 */
export function getWindowMenuEventHandlers(devMode: boolean): Map<IpcEventType, () => Promise<void>> {
  const map = new Map<IpcEventType, () => Promise<void>>();

  map.set(IpcEventType.MenuClickSettings, async () => {
    await router.push('/settings');
  });

  map.set(IpcEventType.MenuClickAbout, async () => {
    await router.push('/settings/about');
  });

  if (devMode) {
    map.set(IpcEventType.MenuClickUiDemo, async () => {
      await router.push('/ui-demo');
    });
  }

  return map;
}
