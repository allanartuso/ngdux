# @ngdux/form

The @ngdux/form gives you a full state to simplify how to create, load, save and delete a resource.
It was created to reduce the ngrx/store boilerplate code

## Installation

npm install @ngdux/form

Example:

## Option 1 - Full state

https://github.com/allanartuso/ngdux/tree/master/libs/demo/data-access/properties/src/lib/%2Bstate/property

### State

```
import { InjectionToken } from '@angular/core';
import { CreateUserDto, UserDto } from '@demo/demo/data-model/users';
import { NotificationService } from '@demo/shared/common/util-notification';
import { ErrorDto } from '@ngdux/data-model-common';
import { FormFacade, provideFormState } from '@ngdux/form';
import { UserService } from './services/user.service';

export const USER_DEFAULT_FEATURE_KEY = 'user';

export type UserFormFacade = FormFacade<UserDto, ErrorDto, CreateUserDto>;
export const UserFormFacade = new InjectionToken<UserFormFacade>('UserFormFacade');

// Passing a different feature key and facade token will create another state for this same feature, without copy and paste code
export function provideDemoDataAccessUserModule(
  featureKey: string = USER_DEFAULT_FEATURE_KEY,
  facadeToken: InjectionToken<UserFormFacade> = UserFormFacade,
) {
  return provideFormState(featureKey, facadeToken, UserService, NotificationService);
}
```

## Option 2 - Separated creators for actions, reducer and selectors

### State

```
import { AbstractType, EnvironmentProviders, inject, InjectionToken, Provider } from '@angular/core';
import { FormNotificationService, FormService } from '@ngdux/data-model-common';
import { provideEffects } from '@ngrx/effects';
import { Action, createFeatureSelector, provideState, Store } from '@ngrx/store';
import { FormFacade, FormState } from '../models/form.model';
import { createFormActions } from './form-actions';
import { createFormEffects } from './form-effects';
import { createFormFacade } from './form-facade';
import { createFormReducer } from './form-reducer';
import { createFormSelectors } from './form-selectors';

export function provideFormState<DTO, ERROR, CREATE_DTO = DTO>(
  featureKey: string,
  facadeToken: InjectionToken<FormFacade<DTO, ERROR, CREATE_DTO>>,
  service: AbstractType<FormService<DTO, CREATE_DTO>>,
  notificationService: AbstractType<FormNotificationService<ERROR>>,
): (Provider | EnvironmentProviders)[] {
  const actions = {
    ...createFormActions<DTO, ERROR, CREATE_DTO>(featureKey),
    // Custom actions can be added here
  };
  const formReducer = createFormReducer(actions, [
    // Custom on(...) handlers can be added here
  ]);
  const getState = createFeatureSelector<FormState<DTO, ERROR>>(featureKey);
  const selectors = {
    ...createFormSelectors(getState),
    // Custom selectors can be added here
  };

  const reducer = (state: FormState<DTO, ERROR>, action: Action): FormState<DTO, ERROR> => formReducer(state, action);

  return [
    provideState(featureKey, reducer),
    {
      provide: facadeToken,
      useFactory: () => ({
        ...createFormFacade(actions, selectors, inject(Store)),
        // Custom facade properties and methods can be added here
      }),
    },
    provideEffects([
      createFormEffects(
        actions,
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
