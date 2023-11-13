import { Inject, Injectable } from '@angular/core';
import { SmartphoneDto } from '@demo/demo/data-model/smartphones';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListFacade, ListStateService } from '@ngdux/list';
import { Store } from '@ngrx/store';
import { SMARTPHONES_LIST_FEATURE_KEY } from '../models/list.model';

@Injectable()
export class SmartphonesListFacade extends AbstractListFacade<SmartphoneDto, ErrorDto> {
  constructor(
    store: Store,
    listStateService: ListStateService<SmartphoneDto, ErrorDto>,
    @Inject(SMARTPHONES_LIST_FEATURE_KEY) featureKey: string
  ) {
    super(store, listStateService.getFeatureActions(featureKey), listStateService.getFeatureSelectors(featureKey));
  }
}
