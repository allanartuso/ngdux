import { Injectable } from '@angular/core';
import { PropertyDto } from '@demo/demo/data-model/properties';
import { NotificationService } from '@demo/shared/util-notification';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListEffects } from '@ngdux/list';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PropertyService } from '../../services/property.service';
import { propertiesActions, propertiesSelectors } from './properties.state';

@Injectable()
export class PropertiesEffects extends AbstractListEffects<PropertyDto, ErrorDto> {
  constructor(actions$: Actions, store: Store, service: PropertyService, formNotificationService: NotificationService) {
    super(actions$, store, service, propertiesActions, propertiesSelectors, formNotificationService);
  }
}
