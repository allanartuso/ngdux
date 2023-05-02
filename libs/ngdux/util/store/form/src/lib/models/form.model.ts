import { InjectionToken } from '@angular/core';
import { RequestState } from '@ngdux/data-model-common';
import { ApiRequestState, LoadingState } from '@ngdux/store-common';
import { ActionCreator, MemoizedSelector } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

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
  load: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
  loadSuccess: ActionCreator<string, (props: { resource: DTO }) => { resource: DTO } & TypedAction<string>>;
  loadFailure: ActionCreator<string, (props: { errors: ERROR }) => { errors: ERROR } & TypedAction<string>>;

  save: ActionCreator<string, (props: { resource: DTO }) => { resource: DTO } & TypedAction<string>>;
  saveSuccess: ActionCreator<string, (props: { resource: DTO }) => { resource: DTO } & TypedAction<string>>;
  saveFailure: ActionCreator<string, (props: { errors: ERROR }) => { errors: ERROR } & TypedAction<string>>;

  delete: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
  deleteSuccess: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
  deleteFailure: ActionCreator<string, (props: { errors: ERROR }) => { errors: ERROR } & TypedAction<string>>;

  create: ActionCreator<string, (props: { resource: CREATE_DTO }) => { resource: CREATE_DTO } & TypedAction<string>>;
  createSuccess: ActionCreator<string, (props: { resource: DTO }) => { resource: DTO } & TypedAction<string>>;
  createFailure: ActionCreator<string, (props: { errors: ERROR }) => { errors: ERROR } & TypedAction<string>>;

  reset: ActionCreator<string, () => TypedAction<string>>;
}
