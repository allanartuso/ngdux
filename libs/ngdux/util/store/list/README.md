# @ngdux/list

The @ngdux/list gives you a full state to simplify how to create, load, save and delete a resource.

Example:

## Option 1 - Full state

### State

```
import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { createListState } from '@ngdux/list';

export const USERS_FEATURE_KEY = 'users';
export const {
  actions: usesActions,
  selectors: usersSelectors,
  reducer: usersReducer,
  entityAdapter: usersEntityAdapter
} = createListState<UserDto, ErrorDto>(USERS_FEATURE_KEY);
```

### Facade

```
import { Injectable } from '@angular/core';
import { AbstractListFacade } from '@ngdux/list';
import { Store } from '@ngrx/store';
import { usersActions, usersSelectors } from './users.state';
import { User, Error } from './models';

@Injectable()
export class UsersFacade extends AbstractListFacade<User, Error> {
  constructor(store: Store) {
    super(store, usersActions, usersSelectors);
  }
}
```

## Option 2 - Separated creators for actions, reducer and selectors

### Actions

```
import { createListActions } from '@ngdux/list';
import { User, Error } from './models';

export const usersActions = createListActions<User, Error>('Users');
```

### Reducer

```
import { createListEntityAdapter, createListReducer, ListState } from '@ngdux/list';
import { Action } from '@ngrx/store';
import { User, Error } from './models';
import { usersActions } from './users.actions';

export const USERS_FEATURE_KEY = 'users';
export const entityAdapter = createListEntityAdapter<User>();

const reducer = createListReducer<User, Error>(entityAdapter, usersActions);

export function usersReducer(state: ListState<User, Error>, action: Action): ListState<User, Error> {
  return reducer(state, action);
}
```

### Selectors

```
import { createListSelectors, ListState } from '@ngdux/list';
import { createFeatureSelector } from '@ngrx/store';
import { User, Error } from './models';
import { entityAdapter, USERS_FEATURE_KEY } from './users.reducer';

const getState = createFeatureSelector<ListState<User, Error>>(USERS_FEATURE_KEY);

export const usersSelectors = createListSelectors(entityAdapter, getState);
```

### Facade

```
import { Injectable } from '@angular/core';
import { AbstractListFacade } from '@ngdux/list';
import { Store } from '@ngrx/store';
import { usersActions } from './users.actions';
import { usersSelectors } from './users.selectors';

@Injectable()
export class UsersFacade extends AbstractListFacade<User, Error> {
  constructor(store: Store) {
    super(store, userActions, usersSelectors);
  }
}
```

## Option 3 - Dynamic feature key

### Reducer manager service

```
import { Injectable } from '@angular/core';
import { User, Error } from '.../models';
import { AbstractListReducerManager } from '@ngdux/list';

@Injectable()
export class UsersReducerManager extends AbstractListReducerManager<User, Error> {}
```

### Facade

```
import { Injectable } from '@angular/core';
import { AbstractListFacade } from '@ngdux/list';
import { Store } from '@ngrx/store';
import { UsersReducerManager } from './users-state.service';

@Injectable()
export class UsersFacade extends AbstractListFacade<User, Error> {
  constructor(store: Store, usersReducerManager: UsersReducerManager) {
    super(store, usersReducerManager.actions, usersReducerManager.selectors);
  }
}

```

### Module

```
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LIST_FEATURE_KEY } from '@ngdux/list';
import { UsersReducerManager } from './+state/users/users-state.service';
import { UsersFacade } from './+state/users/users.facade';

@NgModule({
  providers: [
    UsersReducerManager,
    UsersFacade
  ]
})
export class UsersModule {
  static config(listFeatureKey: string): ModuleWithProviders<UsersModule> {
    return {
      ngModule: UsersModule,
      providers: [
        { provide: LIST_FEATURE_KEY, useValue: listFeatureKey  },
      ]
    };
  }
}
```

## Effects

```
import { Injectable } from '@angular/core';
import { NotificationService } from '@demo/shared/util-notification';
import { AbstractListEffects } from '@ngdux/list';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserService } from '../../services/user.service';
import { usersActions } from './users.actions';
import { usersSelectors } from './users.selectors';
import { User, Error } from './models';

@Injectable()
export class UsersEffects extends AbstractListEffects<User, Error> {
  override texts = {
    deleteConfirmationTitle: 'Delete users',
    deleteConfirmationMessage: 'Are you sure to delete the selected users?',
    deletedMessage: 'The users were deleted successfully.'
  };

  constructor(
    actions$: Actions,
    store: Store,
    usersService: UserService,
    notificationService: NotificationService
  ) {
    super(actions$, store, usersService, usersActions, usersSelectors, notificationService);
  }
}
```

## Service

```
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListService, RequestOptions } from '@ngdux/list';
import { Observable } from 'rxjs';
import { Error, User, USERS_RESOURCE_BASE_PATH } from './models';
import { createRequestParameters } from './utils';

@Injectable({
  providedIn: 'root'
})
export class UserService implements ListService<User, Error> {
  constructor(private httpClient: HttpClient) {}

  loadResources(options: RequestOptions): Observable<User[]> {
    const params = new HttpParams({ fromObject: createRequestParameters(options) });
    return this.httpClient.get<User[]>(USERS_RESOURCE_BASE_PATH, { params });
  }

  deleteResources(ids: string[]): Observable<User[]> {
    return this.httpClient.delete<User[]>(USERS_RESOURCE_BASE_PATH, { body: ids });
  }

  patchResources?(ids: string[], resource: Partial<User>): Observable<Array<User>> {
    return this.httpClient.patch<Array<User>>(
      USERS_RESOURCE_BASE_PATH,
      ids.map(id => ({ id, resource }))
    );
  }
}
```

## Notification Service

```
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListNotificationService } from '@ngdux/list';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { Error } from './models';

@Injectable()
export class NotificationService implements ListNotificationService<Error> {
  constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog) {}

  onListErrors(errors: Error): void {
    this.snackBar.open(errors.message);
  }

  onListDelete(ids: string[]): void {
    this.snackBar.open(`Resources ${ids.join(', ')} have been deleted.`);
  }

  openConfirmationDialog(data: { message: string; title: string }): Observable<boolean> {
    const dialog = this.dialog.open(ConfirmationDialogComponent, { data });

    return dialog.afterClosed();
  }
}
```
