import type { Repo } from './repo.interface';

/**
 * Represents a directory that may contain Git repositories and subdirectories.
 */
export interface ReposDirectory {
  /**
   * The full path of the directory.
   */
  path: string;

  /**
   * The label for the directory.
   * This is the relative path from the parent node.
   * For the root node, this is the absolute path to the first directory level.
   */
  label: string;

  /**
   * The subdirectories contained within this directory.
   */
  dirs: ReposDirectory[];

  /**
   * The repositories contained within this directory.
   */
  repos: Repo[];

  /**
   * The count of repositories contained within this directory and its subdirectories.
   */
  repoCount: number;
}
