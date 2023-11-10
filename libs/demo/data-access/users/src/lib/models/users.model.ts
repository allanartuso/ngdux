import { InjectionToken } from '@angular/core';

export const USER_LIST_FEATURE_KEY = new InjectionToken<string>('USER_LIST_FEATURE_KEY');

export interface DataAccessUsersModuleConfig {
  formFeatureKey?: string;
  listFeatureKey?: string;
}
