import { InjectionToken } from '@angular/core';

export interface DataAccessSmartphonesModuleConfig {
  listFeatureKey?: string;
}

export const SMARTPHONES_DEFAULT_FEATURE_KEY = 'smartphones';

export const SMARTPHONES_LIST_FEATURE_KEY = new InjectionToken<string>('SMARTPHONES_LIST_FEATURE_KEY');
