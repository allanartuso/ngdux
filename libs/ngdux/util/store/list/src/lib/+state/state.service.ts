import { Injectable } from '@angular/core';
import { AbstractListReducerManager } from '../state-generator/abstract-list-state.service';

@Injectable()
export class ListReducerManager<
  T extends { [key: string]: any },
  Error = unknown,
  S extends { [key: string]: any } = T
> extends AbstractListReducerManager<T, Error, S> {}
