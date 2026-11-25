import { RequestState } from '@ngdux/data-model-common';
import { createLoadingStateActionHandlers, createRequestStateActionHandlers } from '@ngdux/store-common';
import { ActionCreator, ActionReducer, ReducerTypes, createReducer, on } from '@ngrx/store';
import { FormActions, FormState } from '../models/form.model';

/**
 * Creates the reducer of a form feature.
 *
 * To extend the state, type `actionHandlers` with your `State` (it is inferred from them, so no cast is needed) and
 * pass the initial values of the added properties in `initialFormState` (it may also override the ngdux defaults).
 */
export function createFormReducer<DTO, ERROR, CREATE_DTO = DTO>(
  actions: FormActions<DTO, ERROR, CREATE_DTO>,
  actionHandlers?: ReducerTypes<FormState<DTO, ERROR>, ActionCreator[]>[],
  initialFormState?: Partial<FormState<DTO, ERROR>>,
): ActionReducer<FormState<DTO, ERROR>>;
export function createFormReducer<DTO, ERROR, CREATE_DTO, State extends FormState<DTO, ERROR>>(
  actions: FormActions<DTO, ERROR, CREATE_DTO>,
  actionHandlers: ReducerTypes<State, ActionCreator[]>[],
  initialFormState: Omit<NoInfer<State>, keyof FormState<DTO, ERROR>> & Partial<FormState<DTO, ERROR>>,
): ActionReducer<State>;
export function createFormReducer<DTO, ERROR, CREATE_DTO, Extra extends object>(
  actions: FormActions<DTO, ERROR, CREATE_DTO>,
  actionHandlers: ReducerTypes<FormState<DTO, ERROR> & Extra, ActionCreator[]>[] = [],
  initialFormState: Extra & Partial<FormState<DTO, ERROR>>,
): ActionReducer<FormState<DTO, ERROR> & Extra> {
  const initialState: FormState<DTO, ERROR> & Extra = { ...createInitialFormState<DTO, ERROR>(), ...initialFormState };
  const reducer = createReducer(
    initialState,
    ...createFormActionHandlers<DTO, ERROR, CREATE_DTO, FormState<DTO, ERROR> & Extra>(actions),
    ...actionHandlers,
  );

  // Reset restarts from the initial state; `reset` handlers in `actionHandlers` still run on top of it.
  return (state, action) => reducer(action.type === actions.reset.type ? undefined : state, action);
}

function createInitialFormState<DTO, ERROR>(): FormState<DTO, ERROR> {
  return {
    resource: undefined,
    loadingState: RequestState.IDLE,
    requestState: RequestState.IDLE,
    errors: undefined,
  };
}

function createFormActionHandlers<DTO, ERROR, CREATE_DTO, State extends FormState<DTO, ERROR>>(
  actions: FormActions<DTO, ERROR, CREATE_DTO>,
): ReducerTypes<State, ActionCreator[]>[] {
  return [
    on(actions.mutationUnavailable, state => ({ ...state, requestState: RequestState.FAILURE })),
    on(actions.loadSuccess, actions.createSuccess, actions.saveSuccess, (state, { resource }) => ({
      ...state,
      resource,
    })),
    on(actions.deleteSuccess, state => ({
      ...state,
      resource: undefined,
    })),
    ...createRequestStateActionHandlers<State, ERROR>(
      actions.load,
      actions.save,
      actions.saveSuccess,
      actions.saveFailure,
    ),
    ...createRequestStateActionHandlers<State, ERROR>(
      undefined,
      actions.create,
      actions.createSuccess,
      actions.createFailure,
    ),
    ...createRequestStateActionHandlers<State, ERROR>(
      undefined,
      actions.delete,
      actions.deleteSuccess,
      actions.deleteFailure,
    ),
    ...createLoadingStateActionHandlers<State>(actions.load, actions.loadSuccess, actions.loadFailure),
  ];
}
