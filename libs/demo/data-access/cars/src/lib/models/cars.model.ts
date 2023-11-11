import { InjectionToken } from '@angular/core';

export interface DataAccessCarsModuleConfig {
  listFeatureKey?: string;
}

export const CARS_DEFAULT_FEATURE_KEY = 'cars';

export const CARS_LIST_FEATURE_KEY = new InjectionToken<string>('CARS_LIST_FEATURE_KEY');
