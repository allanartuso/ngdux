# @ngdux/list

The @ngdux/list uses ngrx/store to give you a full state to make easy to load, save and delete resources. It gives also support to paging, filtering and sorting.
It was created to reduce the ngrx/store boilerplate code

## Installation

npm install @ngdux/list

Example:

## Option 1 - Full state

https://github.com/allanartuso/ngdux/tree/master/libs/demo/data-access/properties/src/lib/%2Bstate/properties

### State

```
import { InjectionToken } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { NotificationService } from '@demo/shared/common/util-notification';
import { ErrorDto } from '@ngdux/data-model-common';
import { ListFacade, provideListState } from '@ngdux/list';
import { UserService } from './services/user.service';

export const USERS_DEFAULT_FEATURE_KEY = 'users';

export type UsersListFacade = ListFacade<UserDto, ErrorDto>;
export const UsersListFacade = new InjectionToken<UsersListFacade>('UsersListFacade');

// Passing a different feature key and facade token will create another state for this same feature, without copy and paste code
export function provideDemoDataAccessUsersModule(
  featureKey: string = USERS_DEFAULT_FEATURE_KEY,
  facadeToken: InjectionToken<UsersListFacade> = UsersListFacade,
) {
  return provideListState(featureKey, facadeToken, UserService, NotificationService);
}

```

## Option 2 - Separated creators for actions, reducer and selectors

### State

```
import { AbstractType, EnvironmentProviders, inject, InjectionToken, Provider } from '@angular/core';
import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { provideEffects } from '@ngrx/effects';
import { Action, createFeatureSelector, provideState, Store } from '@ngrx/store';
import { ListFacade, ListState } from '../models/list.model';
import { NotificationServicePlaceholder } from '../services/list-notification-service';
import { createListActions } from './list-actions';
import { createListEffects } from './list-effects';
import { createListFacade } from './list-facade';
import { createListEntityAdapter, createListReducer } from './list-reducer';
import { createListSelectors } from './list-selectors';

export function createListState<
  T extends { [key: string]: any },
  E,
  S extends { [key: string]: any } = T,
  Params = Record<string, string>,
>(featureName: string, idKey?: string) {
  const actions = createListActions<T, E, S, Params>(featureName);
  const entityAdapter = createListEntityAdapter<S>(idKey);
  const reducer = createListReducer<T, E, S, Params>(entityAdapter, actions);
  const getState = createFeatureSelector<ListState<S, E, Params>>(featureName);
  const selectors = createListSelectors<S, E, Params>(entityAdapter, getState);

  return {
    actions,
    reducer: (state: ListState<S, E, Params>, action: Action): ListState<S, E, Params> => reducer(state, action),
    selectors,
    entityAdapter,
  };
}

export function provideListState<
  Data extends { [key: string]: any },
  Error = unknown,
  Summary extends { [key: string]: any } = Data,
  Params = Record<string, string>,
>(
  featureKey: string,
  facadeToken: InjectionToken<ListFacade<Data, Error, Summary, Params>>,
  service: AbstractType<ListService<Data, Summary, Params>>,
  notificationService: AbstractType<ListNotificationService<Error>> = NotificationServicePlaceholder<Error>,
  idKey?: string,
): (Provider | EnvironmentProviders)[] {
  const actions = {
    ...createListActions<Data, Error, Summary, Params>(featureKey),
    // Custom actions can be added here
  };
  const entityAdapter = createListEntityAdapter<Summary>(idKey);
  const listReducer = createListReducer<Data, Error, Summary, Params>(
    entityAdapter,
    actions,
    // Custom handlers
    // [on(actions.myAction, () => {})]
  );
  const getState = createFeatureSelector<ListState<Summary, Error, Params>>(featureKey);
  const selectors = {
    ...createListSelectors<Summary, Error, Params>(entityAdapter, getState),
    // Custom selectors can be added here
  };

  const reducer = (state: ListState<Summary, Error, Params>, action: Action): ListState<Summary, Error, Params> =>
    listReducer(state, action);

  return [
    provideState(featureKey, reducer),
    {
      provide: facadeToken,
      useFactory: () => ({
        ...createListFacade(actions, selectors, inject(Store)),
        // Custom facade properties and methods can be added here
      }),
    },
    provideEffects([
      createListEffects(
        actions,
        selectors,
        () => inject(service),
        () => inject(notificationService),
      ),
      // custom effects can be added here
    ]),
    service as Provider,
    notificationService as Provider,
  ];
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
