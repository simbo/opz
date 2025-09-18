import { IPC_WINDOW_EVENT_NAME } from '../../../shared/ipc/ipc-event-name';
import type { IpcEventType } from '../../../shared/ipc/ipc-event-type.enum';
import type {
  IpcEvent,
  IpcEventHandler,
  IpcEventSubscription,
  IpcWindowCustomEventDetail,
} from '../../../shared/ipc/ipc-events.types';

/**
 * Internal event handlers wrap the user-provided handlers to ensure a consistent async signature.
 */
type InternalIpcEventHandler<T> = (payload: T | undefined) => Promise<void>;

/**
 * Subscriptions are stored per event type, each containing a set of handlers.
 */
const subscriptions = new Map<IpcEventType, Set<InternalIpcEventHandler<any>>>(); // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Type guard to check if an event is an IpcEvent.
 *
 * @param event - The event to check.
 * @returns True if the event is an IpcEvent, false otherwise.
 */
function isIpcEvent<T = unknown>(event: Event): event is IpcEvent<T> {
  return (
    event instanceof CustomEvent &&
    typeof event.detail === 'object' &&
    event.detail !== null &&
    typeof (event.detail as IpcWindowCustomEventDetail<T>).type === 'string'
  );
}

/**
 * The global event handler listens for all IPC events on window and dispatches
 * them to the appropriate handlers.
 */
const globalEventHandler: EventListenerObject = {
  handleEvent: (event: Event): void => {
    if (!isIpcEvent(event)) return;

    const handlers = subscriptions.get(event.detail.type);

    if (!handlers) return;

    for (const handler of handlers) {
      handler(event.detail.payload).catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Error during IPC event handler:', error);
      });
    }
  },
};

/**
 * Register an IPC event handler.
 *
 * @param name - The name of the IPC event.
 * @param handler - The handler function to call when the event is received.
 * @throws {Error} If the handler is already registered for the given event name.
 */
const registerHandler = <T>(name: IpcEventType, handler: InternalIpcEventHandler<T>): void => {
  if (subscriptions.size === 0) {
    window.addEventListener(IPC_WINDOW_EVENT_NAME, globalEventHandler);
  }

  const handlers = (subscriptions.get(name) ??
    subscriptions.set(name, new Set<InternalIpcEventHandler<T>>()).get(name)) as Set<InternalIpcEventHandler<T>>;

  if (handlers.has(handler)) {
    throw new Error(`Handler already registered for IPC event: ${name}`);
  }

  handlers.add(handler);
};

/**
 * Unregister an IPC event handler.
 *
 * @param type - The type of the IPC event.
 * @param handler - The handler function to remove.
 * @throws {Error} If the handler is not found for the given event type.
 */
const unregisterHandler = <T>(type: IpcEventType, handler: InternalIpcEventHandler<T>): void => {
  const handlers = subscriptions.get(type);
  if (!handlers?.has(handler)) {
    throw new Error(`Handler not found for IPC event: ${type}`);
  }

  handlers.delete(handler);

  if (handlers.size === 0) {
    subscriptions.delete(type);
  }

  if (subscriptions.size === 0) {
    window.removeEventListener(IPC_WINDOW_EVENT_NAME, globalEventHandler);
  }
};

/**
 * Subscribe to an IPC event from the main process.
 *
 * @param type - The IPC event to subscribe to.
 * @param handler - The function to call when the event is received.
 * @returns A subscription object with an `off` method to remove the event listener.
 * @throws {Error} If the handler is already registered for the given event type.
 */
export function onIpcEvent<T = unknown>(type: IpcEventType, handler: IpcEventHandler<T>): IpcEventSubscription {
  // Wrap the user-provided handler to ensure it returns a Promise.
  const internalHandler: InternalIpcEventHandler<T> = async payload => {
    await handler(payload);
  };

  // Register the internal handler.
  registerHandler(type, internalHandler);

  // Return the subscription object with the unsubscribe method.
  return {
    unsubscribe: () => {
      unregisterHandler(type, internalHandler);
    },
  };
}
