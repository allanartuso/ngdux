import { createAction, props } from '@ngrx/store';
import { FormActions } from '../models/form.model';

export function createFormActions<DTO, ERROR, CREATE_DTO = DTO>(
  featureName: string
): FormActions<DTO, ERROR, CREATE_DTO> {
  const load = createAction(`[${featureName} API] Load ${featureName}`, props<{ id: string }>());
  const loadSuccess = createAction(`[${featureName} API] Load ${featureName} Success`, props<{ resource: DTO }>());
  const loadFailure = createAction(`[${featureName} API] Load ${featureName} Failure`, props<{ errors: ERROR }>());

  const save = createAction(`[${featureName} API] Save ${featureName}`, props<{ resource: DTO }>());
  const saveSuccess = createAction(`[${featureName} API] Save ${featureName} Success`, props<{ resource: DTO }>());
  const saveFailure = createAction(`[${featureName} API] Save ${featureName} Failure`, props<{ errors: ERROR }>());

  const deleteAction = createAction(`[${featureName} API] Delete ${featureName}`, props<{ id: string }>());
  const deleteSuccess = createAction(`[${featureName} API] Delete ${featureName} Success`, props<{ id: string }>());
  const deleteFailure = createAction(`[${featureName} API] Delete ${featureName} Failure`, props<{ errors: ERROR }>());

  const create = createAction(`[${featureName} API] Create ${featureName}`, props<{ resource: CREATE_DTO }>());
  const createSuccess = createAction(`[${featureName} API] Create ${featureName} Success`, props<{ resource: DTO }>());
  const createFailure = createAction(`[${featureName} API] Create ${featureName} Failure`, props<{ errors: ERROR }>());

  const reset = createAction(`[${featureName} API] Reset ${featureName}`);

  return {
    load,
    loadSuccess,
    loadFailure,
    save,
    saveSuccess,
    saveFailure,
    delete: deleteAction,
    deleteSuccess,
    deleteFailure,
    create,
    createSuccess,
    createFailure,
    reset
  };
}
