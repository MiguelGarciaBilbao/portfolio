'use client';

import { createContext, useContext } from 'react';
import { QUALITY, type Tier } from '@/lib/motion';

export interface SceneQuality {
  tier: Tier;
  particles: number;
  dpr: number;
  bloom: boolean;
}

export const qualityFor = (tier: Tier): SceneQuality => ({ tier, ...QUALITY[tier] });

export const SceneQualityContext = createContext<SceneQuality>(qualityFor('medium'));

export function useSceneQuality(): SceneQuality {
  return useContext(SceneQualityContext);
}
