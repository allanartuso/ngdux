import { Inject, Injectable } from '@angular/core';
import { AgentDto } from '@demo/demo/data-model/agents';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListFacade, ListStateService } from '@ngdux/list';
import { Store } from '@ngrx/store';
import { AGENTS_LIST_FEATURE_KEY } from '../models/list.model';

@Injectable()
export class AgentsListFacade extends AbstractListFacade<AgentDto, ErrorDto> {
  constructor(
    store: Store,
    listStateService: ListStateService<AgentDto, ErrorDto>,
    @Inject(AGENTS_LIST_FEATURE_KEY) featureKey: string
  ) {
    super(store, listStateService.getFeatureActions(featureKey), listStateService.getFeatureSelectors(featureKey));
  }
}
