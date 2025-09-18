import type { Dirent } from 'node:fs';
import { lstat, readdir, stat } from 'node:fs/promises';
import { basename, join } from 'node:path';

import Logger from 'electron-log/main';
import PQueue from 'p-queue';

/**
 * Options for finding Git repository paths.
 */
export interface FindGitRepoPathsOptions {
  /**
   * Directory paths to start searching from
   */
  startFrom: string | string[] | Set<string>;

  /**
   * Maximum depth to search (Default: 5)
   */
  maxDepth?: number;

  /**
   * Folder names to ignore (only name, not path)
   */
  ignores?: string[] | Set<string>;

  /**
   * Follow symlink directories?
   */
  followSymlinks?: boolean;

  /**
   * Maximum concurrency for FS operations (Default: 64)
   */
  concurrency?: number;
}

const DEFAULT_MAX_DEPTH = 5;
const DEFAULT_FOLLOW_SYMLINKS = false;
const DEFAULT_CONCURRENCY = 64;
const DEFAULT_IGNORES = new Set<string>();

/**
 * Find all Git repository paths starting from one or more base paths.
 *
 * @param options - Options for finding Git repository paths.
 * @returns A promise that resolves to an array of Git repository paths.
 */
export async function findGitRepoPaths(options: FindGitRepoPathsOptions): Promise<string[]> {
  // Parse options and set defaults
  const {
    maxDepth = DEFAULT_MAX_DEPTH,
    followSymlinks = DEFAULT_FOLLOW_SYMLINKS,
    concurrency = DEFAULT_CONCURRENCY,
  } = options;
  const ignores = new Set<string>(options.ignores ?? DEFAULT_IGNORES);
  const startFrom = new Set<string>(typeof options.startFrom === 'string' ? [options.startFrom] : options.startFrom);
  const repoPaths = new Set<string>();

  // Create a queue to control concurrency of filesystem operations
  const queue = new PQueue({ concurrency });

  /**
   * Schedule a directory for scanning.
   *
   * @param path - Directory path to scan.
   * @param depth - Current recursion depth.
   */
  const schedule = (path: string, depth: number): void => {
    queue
      .add(async () => {
        // Skip ignored directories by name
        if (ignores.has(basename(path))) return;

        // If the directory is a Git repo, add to results and stop recursion
        if (await isGitRepo(path)) {
          repoPaths.add(path);
          return;
        }

        // Stop recursion if max depth is reached
        if (depth >= maxDepth) return;

        // Read directory entries (files and subdirectories)
        let entries: Dirent[];
        try {
          entries = await readdir(path, { withFileTypes: true });
        } catch {
          // Ignore directories that can't be read (e.g., permissions)
          return;
        }

        // Iterate over directory entries
        for (const entry of entries) {
          // Skip ignored entries by name
          if (ignores.has(entry.name)) continue;

          // Combine parent path with entry name
          const entryPath = join(path, entry.name);

          // Schedule subdirectory
          if (entry.isDirectory()) {
            schedule(entryPath, depth + 1);
          } else if (entry.isSymbolicLink() && followSymlinks) {
            // Optionally follow symlinked directories
            try {
              const result = await stat(entryPath);
              if (result.isDirectory()) {
                schedule(entryPath, depth + 1);
              }
            } catch {
              // Ignore broken symlinks or inaccessible targets
              continue;
            }
          }
        }
      })
      .catch((error: unknown) => {
        // Log errors encountered during scanning
        Logger.error(`Error processing path for finding git repositories: ${path}`, error);
      });
  };

  // Schedule initial directories for scanning
  for (const path of startFrom) {
    schedule(path, 0);
  }

  // Wait for all scheduled tasks to complete
  await queue.onIdle();

  // Return sorted array of unique repository paths
  const sortedRepoPaths = [...repoPaths].toSorted((a, b) => a.localeCompare(b));
  return sortedRepoPaths;
}

/**
 * Check if a given path is a Git repository (i.e., contains a `.git` directory).
 *
 * @param path - The path to check.
 * @returns A promise that resolves to `true` if the path is a Git repository, otherwise `false`.
 */
async function isGitRepo(path: string): Promise<boolean> {
  try {
    await lstat(join(path, '.git'));
    return true;
  } catch {
    return false;
  }
}
