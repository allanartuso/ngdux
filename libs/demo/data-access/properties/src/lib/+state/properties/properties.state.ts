import { PropertyDto } from '@demo/demo/data-model/properties';
import { ErrorDto } from '@ngdux/data-model-common';
import { createListState } from '@ngdux/list';

export const PROPERTIES_FEATURE_KEY = 'properties';

export const {
  actions: propertiesActions,
  selectors: propertiesSelectors,
  reducer: propertiesReducer
} = createListState<PropertyDto, ErrorDto>(PROPERTIES_FEATURE_KEY);
