import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AgentsListFacade } from '@demo/demo/data-access/agents';
import { AgentDto, AGENTS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/agents';
import { createPersistentAgents } from '@demo/demo/data-model/agents/test';
import {
  DEFAULT_FILTERING_LOGIC,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTING_ORDER,
  FilteringOptions,
  PagingOptions,
  SortingDirection,
  SortingField
} from '@ngdux/data-model-common';
import { of } from 'rxjs';
import { AgentsComponent } from './agents.component';

describe('AgentsComponent', () => {
  let component: AgentsComponent;
  let router: Router;
  let agents: AgentDto[];
  let facade: Partial<AgentsListFacade>;

  beforeEach(() => {
    facade = {
      currentPageData$: of([]),
      selectedItems$: of([]),
      totalCount$: of(5),
      pagingOptions$: of({ page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE }),
      sortingOptions$: of({ name: { field: 'name', direction: DEFAULT_SORTING_ORDER } }),
      filteringOptions$: of({ logic: DEFAULT_FILTERING_LOGIC, filters: [] }),
      initialize: jest.fn(),
      loadPage: jest.fn(),
      changePagingOptions: jest.fn(),
      changeFiltering: jest.fn(),
      changeSorting: jest.fn(),
      changeSelectedResources: jest.fn(),
      showRemovalsConfirmation: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }])],
      providers: [AgentsComponent, { provide: AgentsListFacade, useValue: facade }]
    });
  });

  beforeEach(() => {
    component = TestBed.inject(AgentsComponent);
    router = TestBed.inject(Router);

    agents = createPersistentAgents();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits load agents page action two times when refreshing the page', () => {
    component.onRefreshPageSelected();

    expect(facade.loadPage).toHaveBeenCalledTimes(1);
    expect(facade.loadPage).toHaveBeenCalledWith();
  });

  it('emits set agents page size action when setting the page size', () => {
    const pagingOptions: PagingOptions = { page: 2, pageSize: 5 };

    component.onPageOptionsChanged(pagingOptions);

    expect(facade.changePagingOptions).toHaveBeenCalledWith({ pagingOptions });
  });

  it('emits change agents filtering action when filtering', () => {
    const filteringOptions: FilteringOptions = {
      logic: DEFAULT_FILTERING_LOGIC,
      filters: []
    };

    component.onFilteringChanged(filteringOptions);

    expect(facade.changeFiltering).toHaveBeenCalledWith({ filteringOptions });
  });

  it('emits change agents sorting action when sorting', () => {
    const sortingOptions: SortingField[] = [{ field: 'email', direction: SortingDirection.DESCENDING }];

    component.onSortingChanged(sortingOptions);

    expect(facade.changeSorting).toHaveBeenCalledWith({
      sortingOptions: { [sortingOptions[0].field]: sortingOptions[0] }
    });
  });

  it('emits change selected agents action when selecting rows', () => {
    const selectedResourceIds: string[] = agents.map(user => user.id);

    component.onRowSelected(agents);

    expect(facade.changeSelectedResources).toHaveBeenCalledWith({ selectedResourceIds });
  });

  it('emits navigate action when clicking a cell', () => {
    jest.spyOn(router, 'navigate');

    component.onRowClicked(agents[0]);

    expect(router.navigate).toHaveBeenCalledWith([AGENTS_RESOURCE_BASE_PATH, agents[0].id]);
  });
});
