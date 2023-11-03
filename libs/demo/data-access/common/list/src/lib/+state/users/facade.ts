import { Injectable } from '@angular/core';
import { AbstractListFacade } from '@ngdux/list';
import { Store } from '@ngrx/store';
import { ListReducerManager } from './state.service';

@Injectable()
export class ListFacade<
  T extends { [key: string]: any },
  E,
  S extends { [key: string]: any } = T
> extends AbstractListFacade<T, E, S> {
  constructor(store: Store, usersReducerManager: ListReducerManager<T, E, S>) {
    super(store, usersReducerManager.actions, usersReducerManager.selectors);
  }
}
