import { InjectionToken } from '@angular/core';
import { CreatePropertyDto, PropertyDto } from '@demo/demo/data-model/properties';
import { NotificationService } from '@demo/shared/common/util-notification';
import { ErrorDto } from '@ngdux/data-model-common';
import { FormFacade, provideFormState } from '@ngdux/form';
import { ListFacade, provideListState } from '@ngdux/list';
import { PropertyService } from './services/property.service';

export const PROPERTY_FEATURE_KEY = 'property';
export const PROPERTIES_FEATURE_KEY = 'properties';

export type PropertyFacade = FormFacade<PropertyDto, ErrorDto, CreatePropertyDto>;
export const PropertyFacade = new InjectionToken<PropertyFacade>('PropertyFacade');

export function provideDemoDataAccessPropertyModule(
  featureKey: string = PROPERTY_FEATURE_KEY,
  facadeToken: InjectionToken<PropertyFacade> = PropertyFacade
) {
  return provideFormState(featureKey, facadeToken, PropertyService, NotificationService);
}

export type PropertiesFacade = ListFacade<PropertyDto, ErrorDto>;
export const PropertiesFacade = new InjectionToken<PropertiesFacade>('PropertiesFacade');

export function provideDemoDataAccessPropertiesModule(
  featureKey: string = PROPERTIES_FEATURE_KEY,
  facadeToken: InjectionToken<PropertiesFacade> = PropertiesFacade
) {
  return provideListState(featureKey, facadeToken, PropertyService, NotificationService);
}
