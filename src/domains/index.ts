import type { BreviaDomain } from '../types';
import type { DomainAdapter } from './base';
import { LightAdapter } from './light';
import { ClimateAdapter } from './climate';
import { MediaPlayerAdapter } from './media-player';
import { SensorAdapter } from './sensor';

const ADAPTERS: Record<BreviaDomain, DomainAdapter> = {
  light: new LightAdapter(),
  climate: new ClimateAdapter(),
  media_player: new MediaPlayerAdapter(),
  sensor: new SensorAdapter(),
};

export function getDomainAdapter(domain: BreviaDomain): DomainAdapter {
  return ADAPTERS[domain];
}

export type { DomainAdapter, ViewModel, DomainContext } from './base';
