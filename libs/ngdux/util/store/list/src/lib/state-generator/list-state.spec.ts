import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getDefaultRequestOptions, RequestState } from '@ngdux/data-model-common';
import { provideStore } from '@ngrx/store';
import { firstValueFrom, of, Subject } from 'rxjs';
import { ListFacade, ListState } from '../models/list.model';
import { TestListService } from '../models/list.fixture';
import { createListState, provideListState } from './list-state';

interface Summary {
  id: string;
  name: string;
}
interface Resource extends Summary {
  description: string;
}
interface Params {
  tenantId: number;
}

describe('list state providers', () => {
  const token = new InjectionToken<ListFacade<Resource, string[], Summary, Params>>('list');
  const otherToken = new InjectionToken<ListFacade<Resource, string[], Summary, Params>>('other list');
  const resources = [{ id: 'one', name: 'Resource' }];
  let facade: ListFacade<Resource, string[], Summary, Params>;
  let service: TestListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideListState('list', token, TestListService),
        provideListState('otherList', otherToken, TestListService),
      ],
    });
    service = TestBed.inject(TestListService);
    facade = TestBed.inject(token);
  });

  it('loads and selects resources through real reducers and effects', async () => {
    const response = new Subject<Summary[]>();
    service.loadResources.mockReturnValue(response);
    expect(facade.resources()).toEqual([]);
    expect(facade.lastPageNumber()).toBeUndefined();
    expect(facade.requestParameters()).toBeUndefined();
    expect(facade.isReady()).toBe(false);
    facade.loadPage();
    expect(facade.isLoading()).toBe(true);
    response.next(resources);
    expect(facade.resources()).toEqual(resources);
    expect(await firstValueFrom(facade.resources$)).toEqual(resources);
    expect(facade.currentPageData()).toEqual(resources);
    expect(facade.isReady()).toBe(true);
    expect(facade.isLoading()).toBe(false);
    facade.changeSelectedResources({ selectedResourceIds: ['one'] });
    expect(facade.selectedItems()).toEqual(resources);
    expect(facade.areSelectedReady()).toBe(true);
    expect(TestBed.inject(otherToken).resources()).toEqual([]);
    response.complete();
  });

  it('sets typed request parameters without loading and reloads when changed', async () => {
    service.loadResources.mockReturnValue(of(resources));
    facade.setRequestParameters({ params: { tenantId: 1 } });
    expect(facade.requestParameters()).toEqual({ tenantId: 1 });
    expect(service.loadResources).not.toHaveBeenCalled();
    facade.changeRequestParams({ params: { tenantId: 2 } });
    expect(facade.requestParameters()).toEqual({ tenantId: 2 });
    expect(facade.requestOptions().requestParameters?.tenantId).toBe(2);
    expect((await firstValueFrom(facade.requestOptions$)).requestParameters?.tenantId).toBe(2);
    expect(service.loadResources).toHaveBeenCalledWith(expect.objectContaining({ requestParameters: { tenantId: 2 } }));
  });

  it('marks unsupported writes as failed and can handle subsequent requests', () => {
    Object.assign(service, { patchResources: undefined, deleteResources: undefined });
    facade.patch({ resourceIds: ['one'], resource: { name: 'new' } });
    expect(facade.requestState()).toBe(RequestState.FAILURE);
    expect(facade.errors()).toBeUndefined();
    facade.resetRequestState();
    facade.delete({ resourceIds: ['one'] });
    expect(facade.requestState()).toBe(RequestState.FAILURE);

    service.loadResources.mockReturnValue(of(resources));
    facade.loadPage();
    expect(facade.currentPageData()).toEqual(resources);
  });

  it('resets and reloads when reinitialized, with an optional notification service', () => {
    service.loadResources.mockReturnValue(of(resources));
    service.deleteResources.mockReturnValue(of([]));
    facade.setPageSize({ pageSize: 25 });
    facade.loadPage();
    facade.delete({ resourceIds: ['one'] });
    facade.reinitialize();
    expect(facade.pagingOptions().pageSize).toBe(10);
    expect(facade.selectedItems()).toEqual([]);
    expect(facade.isReady()).toBe(true);
  });

  it('drops pending patch and delete responses when reinitialized', () => {
    const patchResponse = new Subject<Resource[]>();
    const deleteResponse = new Subject<void>();
    service.patchResources.mockReturnValue(patchResponse);
    service.deleteResources.mockReturnValue(deleteResponse);
    service.loadResources.mockReturnValue(of(resources));

    facade.patch({ resourceIds: ['one'], resource: { name: 'Updated' } });
    facade.delete({ resourceIds: ['one'] });
    expect(facade.requestState()).toBe(RequestState.IN_PROGRESS);

    facade.reinitialize();
    patchResponse.next([]);
    deleteResponse.error(['Late delete error']);

    expect(facade.requestState()).toBe(RequestState.IDLE);
    expect(facade.errors()).toBeUndefined();
    expect(service.loadResources).toHaveBeenCalledTimes(1);

    service.deleteResources.mockReturnValue(of(undefined));
    facade.delete({ resourceIds: ['one'] });
    expect(facade.requestState()).toBe(RequestState.SUCCESS);
    expect(service.loadResources).toHaveBeenCalledTimes(2);
  });

  it('creates a reducer and selectors with a custom entity ID', () => {
    const { actions, reducer, selectors, entityAdapter } = createListState<{ key: string }, string[]>('custom', 'key');
    const initial = entityAdapter.getInitialState<ListState<{ key: string }, string[]>>({
      ...getDefaultRequestOptions(),
      selectedResourceIds: [],
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
    });
    const state = reducer(
      initial,
      actions.loadPageSuccess({ resources: [{ key: 'custom-id' }], pagingOptions: initial.pagingOptions }),
    );
    expect(selectors.getAll({ custom: state })).toEqual([{ key: 'custom-id' }]);
  });
});
