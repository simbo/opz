/**
 * Check if the current OS is macOS.
 *
 * @returns True if the current OS is macOS, false otherwise.
 */
export function isMacOs(): boolean {
  return process.platform === 'darwin';
}
