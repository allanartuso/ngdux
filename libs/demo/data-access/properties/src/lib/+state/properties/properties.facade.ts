import { Injectable } from '@angular/core';
import { PropertyDto } from '@demo/demo/data-model/properties';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListFacade } from '@ngdux/list';
import { Store } from '@ngrx/store';
import { propertiesActions, propertiesSelectors } from './properties.state';

@Injectable()
export class PropertiesFacade extends AbstractListFacade<PropertyDto, ErrorDto> {
  constructor(store: Store) {
    super(store, propertiesActions, propertiesSelectors);
  }
}
