import { InjectionToken } from '@angular/core';

export interface DataAccessAgentsModuleConfig {
  listFeatureKey?: string;
}

export const AGENTS_DEFAULT_FEATURE_KEY = 'agents';

export const AGENTS_LIST_FEATURE_KEY = new InjectionToken<string>('AGENTS_LIST_FEATURE_KEY');
