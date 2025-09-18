import { join, sep } from 'node:path';

import type { Repo } from '../../shared/repos/repo.interface';
import type { ReposDirectory } from '../../shared/repos/repos-directory.interface';

interface InternalReposDirectory extends Omit<ReposDirectory, 'dirs' | 'repos' | 'repoCount'> {
  dirs: Map<string, InternalReposDirectory>;
  repos: Map<string, Repo>;
}

/**
 * Builds a hierarchical tree structure representing repositories from a list of
 * file system paths containing repositories.
 *
 * @param paths - An array of repository paths to be organized into a directory tree.
 * @returns A `ReposDirectory` object representing the root of the constructed repository tree.
 *
 * The function performs the following steps:
 * - Initializes the root directory node.
 * - Iterates over each path, splitting it into directory parts.
 * - Traverses or creates directory nodes for each part, adding repositories at leaf nodes.
 * - Merges directories and serializes the final structure for output.
 *
 * This utility is useful for visualizing or managing repositories in a nested directory format.
 */
export function buildReposTree(paths: string[]): ReposDirectory {
  // The root directory to hold further subdirectories and repositories.
  const root: InternalReposDirectory = {
    // This ensures that on Windows, paths are displayed without a leading slash.
    path: sep === '/' ? '/' : '',
    label: '',
    dirs: new Map<string, InternalReposDirectory>(),
    repos: new Map<string, Repo>(),
  };

  // Iterate over each provided path to build the directory structure.
  for (const path of paths) {
    // Split the path into its components, filtering out any empty parts.
    const parts = path.split(sep).filter(Boolean);
    // Start traversing from the root directory.
    let currentDir = root;

    // Iterate through each part of the path to build the directory tree.
    const lastIndex = parts.length - 1;
    for (const [i, part] of parts.entries()) {
      // If this is the last part, it's a repository; add it to the current directory.
      if (i === lastIndex) {
        currentDir.repos.set(part, {
          basename: part,
          path: join(currentDir.path, part),
        });
        break;
      }
      // For directory parts, traverse or create the corresponding directory node.
      let dir = currentDir.dirs.get(part);
      if (!dir) {
        dir = {
          path: join(currentDir.path, part),
          label: part,
          dirs: new Map<string, InternalReposDirectory>(),
          repos: new Map<string, Repo>(),
        };
        currentDir.dirs.set(part, dir);
      }
      currentDir = dir;
    }
  }

  // Merge directories with single subdirectories.
  const merged = mergeDirs(root);

  // Serialize the internal structure to the expected output format.
  const serialized = serializeDir(merged);

  return serialized;
}

/**
 * Merge directories that contain only a single subdirectory and no repositories.
 *
 * @param dir - The directory to process
 * @returns The merged directory
 */
function mergeDirs(dir: InternalReposDirectory): InternalReposDirectory {
  while (dir.dirs.size === 1 && dir.repos.size === 0) {
    const [subDir] = dir.dirs.values();
    dir.path = subDir.path;
    dir.label = join(dir.label, subDir.label);
    dir.dirs = subDir.dirs;
    dir.repos = subDir.repos;
  }
  for (const [key, subDir] of dir.dirs) {
    dir.dirs.set(key, mergeDirs(subDir));
  }
  return dir;
}

/**
 * Serialize InternalReposDirectory to ReposDirectory.
 *
 * @param dir - The internal directory structure to serialize
 * @returns The serialized ReposDirectory
 */
function serializeDir(dir: InternalReposDirectory): ReposDirectory {
  const { path, label, dirs, repos } = dir;
  return {
    path,
    label,
    dirs: [...dirs.values()].map(subdir => serializeDir(subdir)),
    repos: [...repos.values()],
    repoCount: countRepos(dir),
  };
}

/**
 * Count the number of repositories in a directory and its subdirectories.
 *
 * @param dir - The directory to count repositories in
 * @returns The total number of repositories
 */
function countRepos(dir: InternalReposDirectory): number {
  let count = dir.repos.size;
  for (const subDir of dir.dirs.values()) {
    count += countRepos(subDir);
  }
  return count;
}
