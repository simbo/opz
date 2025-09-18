/**
 * Enumeration of known IPC invokes.
 *
 * Values are used to create `window.ipc` methods in the preload script,
 * and to register handlers in the main process.
 */
export enum IpcInvoke {
  AppInfo = 'appInfo',
  AppRestart = 'appRestart',
  OpenExternal = 'openExternal',
  SelectBasePathsForRepos = 'selectBasePathsForRepos',
  SetUserSettings = 'setUserSettings',
  GetUserSettings = 'getUserSettings',
  ResetUserSettings = 'resetUserSettings',
  ReposTree = 'reposTree',
}
