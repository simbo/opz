/**
 * Represents a Git repository with its base name and full path.
 */
export interface Repo {
  /**
   * The base name (folder name) of the repository.
   */
  basename: string;

  /**
   * The full path to the repository.
   */
  path: string;
}
