import type { IpcEventType } from './ipc-event-type.enum';

/**
 * A CustomEvent used for IPC communication.
 *
 * Such events are dispatched on the window object by the preload script.
 */
export type IpcEvent<T = unknown> = CustomEvent<IpcWindowCustomEventDetail<T>>;

/**
 * Details of a CustomEvent used for IPC communication.
 */
export interface IpcWindowCustomEventDetail<T = unknown> {
  /**
   * The type of the IPC event.
   */
  type: IpcEventType;

  /**
   * The optional payload sent with the event.
   */
  payload?: T;
}

/**
 * A handler function for an IPC event.
 *
 * The handler receives the event payload and can optionally be asynchronous.
 */
export type IpcEventHandler<T = unknown> = (payload: T | undefined) => Promise<void> | void;

/**
 * An object representing a subscription to an IPC event.
 *
 * This is returned by the `onIpcEvent` function and provides an `off`
 * method to remove the event listener.
 */
export interface IpcEventSubscription {
  /**
   * Unregister the IPC event handler.
   *
   * @returns void
   * @throws {Error} If the handler is not found for the given event name.
   */
  unsubscribe: () => void;
}
