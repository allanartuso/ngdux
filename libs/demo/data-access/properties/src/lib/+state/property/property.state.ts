import { PropertyDto } from '@demo/demo/data-model/properties';
import { ErrorDto } from '@ngdux/data-model-common';
import { createFormState } from '@ngdux/form';

export const PROPERTY_FEATURE_KEY = 'property';

export const {
  actions: propertyActions,
  selectors: propertySelectors,
  reducer: propertyReducer
} = createFormState<PropertyDto, ErrorDto>(PROPERTY_FEATURE_KEY);
