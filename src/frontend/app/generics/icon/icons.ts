import type { IconName, IconSize, OcticonIconName } from './icon.types';
import { SvgIcon } from './svg-icon.enum';

const SVG_ICON_NAMES: ReadonlySet<SvgIcon> = new Set(Object.values(SvgIcon));

const SVG_ICONS = new Map<SvgIcon, () => Promise<string>>([
  [SvgIcon.Opz, async () => (await import('./svg-icons/opz.svg?raw')).default],
]);

/**
 * Check if the given icon name is a known SVG icon.
 *
 * @param name - The icon name to check.
 * @returns True if the icon name is a known SVG icon, false otherwise.
 */
export function isSvgIcon(name: string): name is SvgIcon {
  return SVG_ICON_NAMES.has(name as SvgIcon);
}

/**
 * Load the SVG content for the given SVG icon name.
 *
 * @param name - The SVG icon name.
 * @returns A promise that resolves to the SVG content as a string.
 * @throws {Error} An error if the icon name is not recognized.
 */
export async function loadSvgIcon(name: SvgIcon): Promise<string> {
  const loader = SVG_ICONS.get(name);
  if (!loader) {
    throw new Error(`Unknown SVG icon: ${name}`);
  }
  return loader();
}

/**
 * Load the SVG content for the given octicon name and size.
 *
 * @param name - The octicon name.
 * @param size - The octicon size.
 * @returns The SVG content as a string.
 */
export async function loadOcticonSvg(name: OcticonIconName, size: IconSize): Promise<string> {
  const { default: octicons } = await import('@primer/octicons');
  return octicons[name].toSVG({ width: size, height: size }).replaceAll(/<path\s/g, `<path fill="currentColor" `);
}

/**
 * Load the SVG content for the given icon name.
 *
 * @param name - The icon name to load.
 * @param size - The icon size to load (only used for octicons).
 * @returns A promise that resolves to the SVG content as a string.
 */
export async function loadIcon(name: IconName, size: IconSize): Promise<string> {
  return isSvgIcon(name) ? loadSvgIcon(name) : loadOcticonSvg(name, size);
}
