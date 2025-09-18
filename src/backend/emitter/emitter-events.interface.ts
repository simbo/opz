import type { UserSettings } from '../../shared/user-settings/user-settings.types';

import type { EmitterEvent } from './emitter-event.enum';

export interface EmitterEvents {
  [EmitterEvent.UserSettingsUpdated]: UserSettings;
}
