import type { IconName as OcticonIconName_, IconSize as OcticonIconSize } from '@primer/octicons';

import type { SvgIcon } from './svg-icon.enum';

export type OcticonIconName = OcticonIconName_;

export type IconName = OcticonIconName | SvgIcon;

export type IconSize = OcticonIconSize;
