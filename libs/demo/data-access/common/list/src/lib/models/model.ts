import { InjectionToken } from '@angular/core';

export interface DataAccessCommonListModuleConfig {
  listFeatureKey: string;
}

export const LIST_SERVICE = new InjectionToken<string>('LIST_SERVICE');
