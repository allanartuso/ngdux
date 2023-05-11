# @ngdux/form

The @ngdux/form gives you a full state to simplify how to create, load, save and delete a resource.

Example:

## Option 1 - Full state

### State

```
import { User, Error } from '.../models';
import { createFormState } from '@ngdux/form';

export const USER_FEATURE_KEY = 'user';
export const {
  actions: userActions,
  selectors: userSelectors,
  reducer: userReducer
} = createFormState<User, Error>(USER_FEATURE_KEY);
```

### Facade

```
import { Injectable } from '@angular/core';
import { AbstractFormFacade } from '@ngdux/form';
import { Store } from '@ngrx/store';
import { userActions, userSelectors } from './user.state';

@Injectable()
export class UserFacade extends AbstractFormFacade<User, Error> {
  constructor(store: Store) {
    super(store, userActions, userSelectors);
  }
}
```

## Option 2 - Separated creators for actions, reducer and selectors

### Actions

```
import { createFormActions } from '@ngdux/form';
import { User, Error } from '.../models';

export const userActions = createFormActions<User, Error>('User');
```

### Reducer

```
import { createFormReducer, FormState } from '@ngdux/form';
import { Action } from '@ngrx/store';
import { User, Error } from '.../models';
import { formActions } from './user.actions';

export const USER_FEATURE_KEY = 'user';
const reducer = createFormReducer(formActions);

export function userReducer(state: FormState<User, Error>, action: Action): FormState<User, Error> {
  return reducer(state, action);
}
```

### Selectors

```
import { createFormSelectors, FormState } from '@ngdux/form';
import { createFeatureSelector } from '@ngrx/store';
import { User, Error } from '.../models';
import { USER_FEATURE_KEY } from './user.reducer';

const getState = createFeatureSelector<FormState<User, Error>>(USER_FEATURE_KEY);

export const userSelectors = createFormSelectors(getState);
```

### Facade

```
import { Injectable } from '@angular/core';
import { AbstractFormFacade } from '@ngdux/form';
import { Store } from '@ngrx/store';
import { userActions } from './user.actions';
import { userSelectors } from './user.selectors';

@Injectable()
export class UserFacade extends AbstractFormFacade<User, Error> {
  constructor(store: Store) {
    super(store, userActions, userSelectors);
  }
}
```

## Option 3 - Dynamic feature key

### Reducer manager service

```
import { Injectable } from '@angular/core';
import { User, Error } from '.../models';
import { AbstractFormReducerManager } from '@ngdux/form';

@Injectable()
export class UserReducerManager extends AbstractFormReducerManager<User, Error> {}
```

### Facade

```
import { Injectable } from '@angular/core';
import { AbstractFormFacade } from '@ngdux/form';
import { Store } from '@ngrx/store';
import { UserReducerManager } from './user-state.service';

@Injectable()
export class UserFacade extends AbstractFormFacade<User, Error> {
  constructor(store: Store, userReducerManager: UserReducerManager) {
    super(store, userReducerManager.actions, userReducerManager.selectors);
  }
}

```

### Module

```
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FORM_FEATURE_KEY } from '@ngdux/form';
import { UserReducerManager } from './+state/user/user-state.service';
import { UserFacade } from './+state/user/user.facade';

@NgModule({
  providers: [
    UserReducerManager,
    UserFacade
  ]
})
export class UserModule {
  static config(formFeatureKey: string): ModuleWithProviders<UserModule> {
    return {
      ngModule: UserModule,
      providers: [
        { provide: FORM_FEATURE_KEY, useValue: formFeatureKey  },
      ]
    };
  }
}
```

## Effects

```
import { Injectable } from '@angular/core';
import { AbstractFormEffects } from '@ngdux/form';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { User, Error } from '.../models';
import { FormNotificationService } from '../notification';
import { UserService } from '../../services/user.service';
import { formActions } from './user.actions';

@Injectable()
export class UserEffects extends AbstractFormEffects<User, Error> {
  constructor(
      actions$: Actions,
      store: Store,
      userService: UserService,
      formNotificationService: FormNotificationService
    ) {
      super(actions$, store, userService, formActions, formNotificationService);
  }
}
```

## Service

```
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormService } from '@ngdux/form';
import { User, USERS_RESOURCE_BASE_PATH } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements FormService<User> {
  constructor(private httpClient: HttpClient) {}

  loadResource(id: string): Observable<User> {
    return this.httpClient.get<User>(`${USERS_RESOURCE_BASE_PATH}/${id}`);
  }

  createResource(user: User): Observable<User> {
    return this.httpClient.post<User>(USERS_RESOURCE_BASE_PATH, user);
  }

  saveResource(user: User): Observable<User> {
    return this.httpClient.put<User>(`${USERS_RESOURCE_BASE_PATH}/${user.id}`, user);
  }

  deleteResource(id: string): Observable<User> {
    return this.httpClient.delete<User>(`${USERS_RESOURCE_BASE_PATH}/${id}`);
  }
}

```

## Notification Service

```
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormNotificationService } from '@demo/ngdux/util/store/form';
import { Error } from '.../models';

@Injectable({
  providedIn: 'root'
})
export class FormNotificationService implements FormNotificationService<Error> {
  constructor(private readonly snackBar: MatSnackBar) {}

  onFormErrors(errors: Error): void {
    this.snackBar.open(errors.message);
  }

  onFormDelete(id: string): void {
    this.snackBar.open(`Resource ${id} has been deleted.`);
  }
}
```
