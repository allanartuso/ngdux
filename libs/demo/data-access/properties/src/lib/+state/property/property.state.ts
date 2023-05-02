import { CreatePropertyDto, PropertyDto } from '@demo/demo/data-model/properties';
import { ErrorDto } from '@ngdux/data-model-common';
import { createFormState } from '@ngdux/form';

export const PROPERTY_FEATURE_KEY = 'property';

export const {
  actions: propertyActions,
  selectors: propertySelectors,
  reducer: propertyReducer
} = createFormState<PropertyDto, ErrorDto, CreatePropertyDto>(PROPERTY_FEATURE_KEY);
