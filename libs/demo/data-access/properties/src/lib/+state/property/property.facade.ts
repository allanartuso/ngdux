import { Injectable } from '@angular/core';
import { PropertyDto } from '@demo/demo/data-model/properties';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractFormFacade } from '@ngdux/form';
import { Store } from '@ngrx/store';
import { propertyActions, propertySelectors } from './property.state';

@Injectable()
export class PropertyFacade extends AbstractFormFacade<PropertyDto, ErrorDto> {
  constructor(store: Store) {
    super(store, propertyActions, propertySelectors);
  }
}
