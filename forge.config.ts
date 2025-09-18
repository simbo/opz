import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { MakerDMG } from '@electron-forge/maker-dmg';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { VitePlugin } from '@electron-forge/plugin-vite';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { $ } from 'execa';

const pkgJsonStr = await readFile(join(import.meta.dirname, 'package.json'), 'utf8');
const pkgJson = JSON.parse(pkgJsonStr) as { productName?: string; name: string };
const APP_NAME = pkgJson.productName ?? pkgJson.name;

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: 'assets/icon',
    name: APP_NAME,
  },
  rebuildConfig: {},
  makers: [
    new MakerDMG(
      {
        format: 'ULFO',
        overwrite: true,
        title: APP_NAME,
        icon: 'assets/dmg-volume.icns',
        iconSize: 128,
        background: 'assets/dmg-volume.png',
        additionalDMGOptions: {
          'background-color': 'rgba(128,128,128,0)',
        },
        contents: opts => [
          { x: 192, y: 128, type: 'file', path: opts.appPath },
          { x: 448, y: 128, type: 'link', path: '/Applications' },
          { x: 192, y: 344, type: 'file', path: 'assets/README.txt' },
          { x: 192, y: 626, type: 'position', path: '.background' },
          { x: 448, y: 626, type: 'position', path: '.VolumeIcon.icns' },
          { x: 192, y: 842, type: 'position', path: '.DS_Store' },
          { x: 448, y: 842, type: 'position', path: '.Trashes' },
        ],
      },
      ['darwin'],
    ),
  ],
  hooks: {
    postPackage: async (_forgeConfig, result) => {
      if (result.platform === 'darwin') {
        for (const path of result.outputPaths) {
          await $`codesign --force --deep --sign - --timestamp=none ${join(path, `${APP_NAME}.app`)}`;
        }
      }
    },
  },
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/backend/main.ts',
          config: 'vite.backend-main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/frontend/preload.ts',
          config: 'vite.frontend-preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.frontend-index.config.ts',
        },
      ],
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
