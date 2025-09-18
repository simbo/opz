import type { IpcMainInvokeEvent } from 'electron/main';

import type { ReposDirectory } from '../../shared/repos/repos-directory.interface';
import { buildReposTree } from '../repos/build-repos-tree';
import { findGitRepoPaths } from '../repos/find-repo-paths';
import { getUserSettings } from '../user-settings/user-settings';

/**
 * Handle the ReposTree IPC invokation.
 *
 * Returns the repositories tree based on user settings.
 *
 * @param _event - The IPC event.
 * @returns The ReposTree.
 */
export async function handleReposTree(_event: IpcMainInvokeEvent): Promise<ReposDirectory> {
  const settings = await getUserSettings();

  const repos = await findGitRepoPaths({
    startFrom: [...settings.reposScan.basePaths],
    maxDepth: settings.reposScan.maxDepth,
    ignores: [...settings.reposScan.ignoreList],
  });

  return buildReposTree(repos);
}
