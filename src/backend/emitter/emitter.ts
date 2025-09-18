import Logger from 'electron-log/main';
import Emittery from 'emittery';

import type { EmitterEvents } from './emitter-events.interface';

/**
 * A global event emitter for the main process.
 */
export const emitter = new Emittery<EmitterEvents>({
  debug: {
    name: 'emitter',
    enabled: false,
    logger: (type, emitterName, eventName, eventData) => {
      Logger.silly(`[${emitterName}][${type}] ${String(eventName)}`, ...(eventData ? [eventData] : []));
    },
  },
});
