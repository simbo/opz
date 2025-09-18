import { IpcInvoke } from '../../shared/ipc/ipc-invoke.enum';

import { handleAppInfo } from './handle-app-info';
import { handleAppRestart } from './handle-app-restart';
import { handleGetUserSettings } from './handle-get-user-settings';
import { handleOpenExternal } from './handle-open-external';
import { handleReposTree } from './handle-repos-tree';
import { handleResetUserSettings } from './handle-reset-user-settings';
import { handleSelectBasePathsForRepos } from './handle-select-base-paths-for-repos';
import { handleSetUserSettings } from './handle-set-user-settings';

/**
 * The IPC invoke handlers registered in the main process.
 */
export const ipcInvokeHandlers = {
  [IpcInvoke.AppInfo]: handleAppInfo,
  [IpcInvoke.AppRestart]: handleAppRestart,
  [IpcInvoke.OpenExternal]: handleOpenExternal,
  [IpcInvoke.GetUserSettings]: handleGetUserSettings,
  [IpcInvoke.SetUserSettings]: handleSetUserSettings,
  [IpcInvoke.ResetUserSettings]: handleResetUserSettings,
  [IpcInvoke.SelectBasePathsForRepos]: handleSelectBasePathsForRepos,
  [IpcInvoke.ReposTree]: handleReposTree,
};

/**
 * The inferred type of the IPC invoke handlers.
 */
export type IpcInvokeHandlers = typeof ipcInvokeHandlers;
