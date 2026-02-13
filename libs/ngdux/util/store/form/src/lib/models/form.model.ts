import { InjectionToken } from '@angular/core';
import { RequestState } from '@ngdux/data-model-common';
import { ActionPayload, ApiRequestState, LoadingState } from '@ngdux/store-common';
import { Action, ActionCreator, MemoizedSelector } from '@ngrx/store';
import { Observable } from 'rxjs';

export const FORM_FEATURE_KEY = new InjectionToken<string>('FORM_FEATURE_KEY');

export interface FormState<T, E> extends ApiRequestState<E>, LoadingState {
  resource?: T;
}

export interface FormSelectors<T, E> {
  getRequestState: MemoizedSelector<object, RequestState>;
  getLoadingState: MemoizedSelector<object, RequestState>;
  getErrors: MemoizedSelector<object, E | undefined>;
  getResource: MemoizedSelector<object, T | undefined>;
  isReady: MemoizedSelector<object, boolean>;
}

export interface FormActions<DTO, ERROR, CREATE_DTO = DTO> {
  load: ActionCreator<string, (props: { id: string }) => { id: string } & Action<string>>;
  loadSuccess: ActionCreator<string, (props: { resource: DTO }) => { resource: DTO } & Action<string>>;
  loadFailure: ActionCreator<string, (props: { errors: ERROR }) => { errors: ERROR } & Action<string>>;

  save: ActionCreator<string, (props: { resource: DTO }) => { resource: DTO } & Action<string>>;
  saveSuccess: ActionCreator<string, (props: { resource: DTO }) => { resource: DTO } & Action<string>>;
  saveFailure: ActionCreator<string, (props: { errors: ERROR }) => { errors: ERROR } & Action<string>>;

  delete: ActionCreator<string, (props: { id: string }) => { id: string } & Action<string>>;
  deleteSuccess: ActionCreator<string, (props: { id: string }) => { id: string } & Action<string>>;
  deleteFailure: ActionCreator<string, (props: { errors: ERROR }) => { errors: ERROR } & Action<string>>;

  create: ActionCreator<string, (props: { resource: CREATE_DTO }) => { resource: CREATE_DTO } & Action<string>>;
  createSuccess: ActionCreator<string, (props: { resource: DTO }) => { resource: DTO } & Action<string>>;
  createFailure: ActionCreator<string, (props: { errors: ERROR }) => { errors: ERROR } & Action<string>>;

  reset: ActionCreator<string, () => Action<string>>;
}

export interface FormFacade<DTO, ERROR, CREATE_DTO = DTO> {
  resource$: Observable<DTO | undefined>;
  loadingState$: Observable<RequestState>;
  requestState$: Observable<RequestState>;
  errors$: Observable<ERROR | undefined>;
  isReady$: Observable<boolean>;

  create(props: ActionPayload<FormActions<DTO, ERROR, CREATE_DTO>['create']>): void;
  load(props: ActionPayload<FormActions<DTO, ERROR, CREATE_DTO>['load']>): void;
  save(props: ActionPayload<FormActions<DTO, ERROR, CREATE_DTO>['save']>): void;
  delete(props: ActionPayload<FormActions<DTO, ERROR, CREATE_DTO>['delete']>): void;
  reset(): void;
}
