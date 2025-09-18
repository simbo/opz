/**
 * The types of IPC events that can be sent from the main process to the
 * renderer processes.
 */
export enum IpcEventType {
  MenuClickAbout = 'MenuClickAbout',
  MenuClickSettings = 'MenuClickSettings',
  MenuClickUiDemo = 'MenuClickUiDemo',
  UserSettingsChanged = 'UserSettingsChanged',
}
