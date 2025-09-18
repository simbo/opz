import { join } from 'node:path';

import { app } from 'electron/main';
import z from 'zod';

import {
  DEFAULT_REPOS_SCAN_IGNORE_LIST,
  DEFAULT_REPOS_SCAN_MAX_DEPTH,
  DEFAULT_REPOS_SCAN_MAX_DEPTH_MAX,
  DEFAULT_REPOS_SCAN_MAX_DEPTH_MIN,
} from '../../shared/user-settings/user-settings-defaults';

const DEFAULT_REPOS_SCAN_PATHS = [join(app.getPath('home'), 'projects')];

/**
 * The schema for user settings.
 */
export const userSettingsSchema = z.strictObject({
  appearance: z
    .strictObject({
      theme: z.enum(['system', 'light', 'dark']).default('system'),
    })
    .default({ theme: 'system' }),
  behavior: z
    .strictObject({
      quitOnAllWindowsClosed: z.boolean().default(true),
    })
    .default({ quitOnAllWindowsClosed: true }),
  devMode: z.boolean().default(!app.isPackaged),
  reposScan: z
    .strictObject({
      basePaths: z
        .array(z.string())
        .default([])
        .transform(arr => {
          if (arr.length === 0) {
            arr.push(...DEFAULT_REPOS_SCAN_PATHS);
          }
          arr = [...new Set(arr)];
          return arr;
        }),
      maxDepth: z
        .number()
        .min(DEFAULT_REPOS_SCAN_MAX_DEPTH_MIN)
        .max(DEFAULT_REPOS_SCAN_MAX_DEPTH_MAX)
        .default(DEFAULT_REPOS_SCAN_MAX_DEPTH)
        .transform(n => Math.max(Math.floor(n), DEFAULT_REPOS_SCAN_MAX_DEPTH_MIN)),
      ignoreList: z
        .array(z.string())
        .default([])
        .transform(arr => {
          arr.unshift(...DEFAULT_REPOS_SCAN_IGNORE_LIST);
          arr = [...new Set(arr)];
          return arr;
        }),
    })
    .default({
      basePaths: [...DEFAULT_REPOS_SCAN_PATHS],
      maxDepth: DEFAULT_REPOS_SCAN_MAX_DEPTH,
      ignoreList: [...DEFAULT_REPOS_SCAN_IGNORE_LIST],
    }),
});
