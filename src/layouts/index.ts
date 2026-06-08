import type { BreviaLayout } from '../types';
import type { Layout } from './base';
import { compactRow } from './compact-row';
import { singleLarge } from './single-large';
import { masterTiles } from './master-tiles';

const LAYOUTS: Record<BreviaLayout, Layout> = {
  'compact-row': compactRow,
  'single-large': singleLarge,
  'master-tiles': masterTiles,
};

export function getLayout(layout: BreviaLayout): Layout {
  return LAYOUTS[layout];
}

export type { Layout, LayoutContext } from './base';
