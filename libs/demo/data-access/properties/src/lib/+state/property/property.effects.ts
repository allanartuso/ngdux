import { Injectable } from '@angular/core';
import { CreatePropertyDto, PropertyDto } from '@demo/demo/data-model/properties';
import { NotificationService } from '@demo/shared/util-notification';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractFormEffects } from '@ngdux/form';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PropertyService } from '../../services/property.service';
import { propertyActions } from './property.state';

@Injectable()
export class PropertyEffects extends AbstractFormEffects<PropertyDto, ErrorDto, CreatePropertyDto> {
  constructor(
    actions$: Actions,
    store: Store,
    formService: PropertyService,
    formNotificationService: NotificationService
  ) {
    super(actions$, store, formService, propertyActions, formNotificationService);
  }
}
