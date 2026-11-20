import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormNotificationService, RequestState } from '@ngdux/data-model-common';
import { provideStore } from '@ngrx/store';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { FormFacade } from '../models/form.model';
import { TestFormService } from '../models/form.fixture';
import { createFormState, provideFormState } from './form-state';

interface Resource {
  id: string;
  name: string;
}
interface CreateResource {
  name: string;
}

const notificationService: FormNotificationService<string[]> = {
  onFormErrors: jest.fn(),
  onFormDelete: jest.fn(),
};
abstract class Notifications implements FormNotificationService<string[]> {
  abstract onFormErrors(errors: string[]): void;
  abstract onFormDelete(id: string): void;
}

describe('form state providers', () => {
  const token = new InjectionToken<FormFacade<Resource, string[], CreateResource>>('form');
  const otherToken = new InjectionToken<FormFacade<Resource, string[], CreateResource>>('other form');
  const resource = { id: 'one', name: 'Resource' };
  let facade: FormFacade<Resource, string[], CreateResource>;
  let service: TestFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideFormState('form', token, TestFormService, Notifications),
        provideFormState('otherForm', otherToken, TestFormService, Notifications),
        { provide: Notifications, useValue: notificationService },
      ],
    });
    service = TestBed.inject(TestFormService);
    facade = TestBed.inject(token);
  });

  it('loads and resets both signals and observables through real reducers and effects', async () => {
    const response = new Subject<Resource>();
    service.loadResource.mockReturnValue(response);
    expect(facade.resource()).toBeUndefined();
    expect(facade.errors()).toBeUndefined();
    expect(facade.isLoading()).toBe(false);
    expect(facade.isReady()).toBe(false);
    facade.load({ id: resource.id });
    expect(service.loadResource).toHaveBeenCalledWith(resource.id);
    expect(facade.isLoading()).toBe(true);
    response.next(resource);
    expect(facade.resource()).toEqual(resource);
    expect(await firstValueFrom(facade.resource$)).toEqual(resource);
    expect(facade.isLoading()).toBe(false);
    expect(facade.isReady()).toBe(true);
    facade.reset();
    expect(facade.resource()).toBeUndefined();
    expect(await firstValueFrom(facade.resource$)).toBeUndefined();
    expect(facade.loadingState()).toBe(RequestState.IDLE);
    response.complete();
  });

  it('supports a separate create DTO and keeps feature instances isolated', () => {
    service.createResource.mockReturnValue(of(resource));
    facade.create({ resource: { name: resource.name } });
    expect(service.createResource).toHaveBeenCalledWith({ name: resource.name });
    expect(facade.resource()).toEqual(resource);
    expect(TestBed.inject(otherToken).resource()).toBeUndefined();
  });

  it('ignores responses from requests that started before reset', () => {
    const response = new Subject<Resource>();
    service.loadResource.mockReturnValue(response);
    service.saveResource.mockReturnValue(response);
    service.createResource.mockReturnValue(response);
    service.deleteResource.mockReturnValue(response);
    facade.load({ id: resource.id });
    facade.save({ resource });
    facade.create({ resource });
    facade.delete({ id: resource.id });

    facade.reset();
    response.next(resource);

    expect(facade.resource()).toBeUndefined();
    expect(facade.loadingState()).toBe(RequestState.IDLE);
    expect(facade.requestState()).toBe(RequestState.IDLE);
    service.loadResource.mockReturnValue(of(resource));
    facade.load({ id: resource.id });
    expect(facade.resource()).toEqual(resource);
  });

  it('marks unsupported writes as failed without fabricating service errors', () => {
    Object.assign(service, { createResource: undefined, saveResource: undefined, deleteResource: undefined });
    facade.create({ resource });
    expect(facade.requestState()).toBe(RequestState.FAILURE);
    facade.reset();
    facade.save({ resource });
    expect(facade.requestState()).toBe(RequestState.FAILURE);
    facade.reset();
    facade.delete({ id: resource.id });
    expect(facade.requestState()).toBe(RequestState.FAILURE);
    expect(facade.errors()).toBeUndefined();
  });

  it('exposes errors and notifies through the functional effects', async () => {
    const errors = ['Save failed'];
    service.saveResource.mockReturnValue(throwError(() => errors));
    facade.save({ resource });
    expect(facade.errors()).toEqual(errors);
    expect(await firstValueFrom(facade.errors$)).toEqual(errors);
    expect(facade.isLoading()).toBe(false);
    expect(notificationService.onFormErrors).toHaveBeenCalledWith(errors);
  });

  it('creates a matching reducer and selectors', () => {
    const { actions, reducer, selectors } = createFormState<Resource, string[]>('custom');
    const initial = reducer({ loadingState: RequestState.IDLE, requestState: RequestState.IDLE }, { type: 'init' });
    const state = reducer(initial, actions.loadSuccess({ resource }));
    expect(selectors.getResource({ custom: state })).toEqual(resource);
    expect(selectors.isReady({ custom: state })).toBe(true);
  });
});
