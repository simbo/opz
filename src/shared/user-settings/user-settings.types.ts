import type z from 'zod';

import type { userSettingsSchema } from '../../backend/user-settings/user-settings-schema';

/**
 * The type representing user settings.
 */
export type UserSettings = z.infer<typeof userSettingsSchema>;
