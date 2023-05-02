import { RequestState } from '@ngdux/data-model-common';
import { createLoadingStateActionHandlers, createRequestStateActionHandlers } from '@ngdux/store-common';
import { ActionCreator, ActionReducer, Creator, ReducerTypes, createReducer, on } from '@ngrx/store';
import { FormActions, FormState } from '../models/form.model';

export function createFormReducer<DTO, ERROR, CREATE_DTO = DTO>(
  actions: FormActions<DTO, ERROR, CREATE_DTO>,
  actionHandlers?: ReducerTypes<FormState<DTO, ERROR>, ActionCreator[]>[],
  initialFormState?: Record<string, any>
): ActionReducer<FormState<DTO, ERROR>> {
  const initialState: FormState<DTO, ERROR> = { ...createInitialFormState<DTO, ERROR>(), ...initialFormState };
  return createReducer<FormState<DTO, ERROR>>(
    initialState,
    ...createFormActionHandlers<DTO, ERROR, CREATE_DTO>(initialState, actions),
    ...(actionHandlers || [])
  );
}

function createInitialFormState<DTO, ERROR>(): FormState<DTO, ERROR> {
  return {
    resource: undefined,
    loadingState: RequestState.IDLE,
    requestState: RequestState.IDLE,
    errors: undefined
  };
}

function createFormActionHandlers<DTO, ERROR, CREATE_DTO = DTO>(
  initialFormState: FormState<DTO, ERROR>,
  actions: FormActions<DTO, ERROR, CREATE_DTO>
): ReducerTypes<FormState<DTO, ERROR>, ActionCreator<string, Creator<any[], object>>[]>[] {
  return [
    on(actions.reset, (): FormState<DTO, ERROR> => initialFormState),
    on(
      actions.loadSuccess,
      actions.createSuccess,
      actions.saveSuccess,
      (state: FormState<DTO, ERROR>, { resource }): FormState<DTO, ERROR> => ({ ...state, resource })
    ),
    on(
      actions.deleteSuccess,
      (state: FormState<DTO, ERROR>): FormState<DTO, ERROR> => ({
        ...state,
        resource: undefined
      })
    ),
    ...createRequestStateActionHandlers<FormState<DTO, ERROR>, ERROR>(
      actions.load,
      actions.save,
      actions.saveSuccess,
      actions.saveFailure
    ),
    ...createRequestStateActionHandlers<FormState<DTO, ERROR>, ERROR>(
      undefined,
      actions.create,
      actions.createSuccess,
      actions.createFailure
    ),
    ...createRequestStateActionHandlers<FormState<DTO, ERROR>, ERROR>(
      undefined,
      actions.delete,
      actions.deleteSuccess,
      actions.deleteFailure
    ),
    ...createLoadingStateActionHandlers<FormState<DTO, ERROR>>(actions.load, actions.loadSuccess, actions.loadFailure)
  ];
}
