import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AbstractListFacade } from '../state-generator/abstract-list.facade';
import { ListReducerManager } from './state.service';

@Injectable()
export class ListFacade<
  T extends { [key: string]: any },
  Error = unknown,
  S extends { [key: string]: any } = T
> extends AbstractListFacade<T, Error, S> {
  constructor(store: Store, usersReducerManager: ListReducerManager<T, Error, S>) {
    super(store, usersReducerManager.actions, usersReducerManager.selectors);
  }
}
