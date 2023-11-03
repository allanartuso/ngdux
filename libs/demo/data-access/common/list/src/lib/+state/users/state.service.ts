import { Injectable } from '@angular/core';
import { AbstractListReducerManager } from '@ngdux/list';

export const USERS_DEFAULT_FEATURE_KEY = 'users';

@Injectable()
export class ListReducerManager<
  T extends { [key: string]: any },
  E,
  S extends { [key: string]: any } = T
> extends AbstractListReducerManager<T, E, S> {}
