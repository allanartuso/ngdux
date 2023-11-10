import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersFacade } from '@demo/demo/data-access/users';
import { USERS_RESOURCE_BASE_PATH, UserDto } from '@demo/demo/data-model/users';
import { createPersistentUsers } from '@demo/demo/data-model/users/test';
import {
  DEFAULT_FILTERING_LOGIC,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTING_ORDER,
  ErrorDto,
  FilteringOptions,
  PagingOptions,
  SortingDirection,
  SortingField
} from '@ngdux/data-model-common';
import { of } from 'rxjs';
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let router: Router;
  let users: UserDto[];
  let facade: Partial<UsersFacade<UserDto, ErrorDto>>;

  beforeEach(() => {
    facade = {
      currentPageData$: of([]),
      selectedItems$: of([]),
      totalCount$: of(5),
      pagingOptions$: of({ page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE }),
      sortingOptions$: of({ name: { field: 'name', direction: DEFAULT_SORTING_ORDER } }),
      filteringOptions$: of({ logic: DEFAULT_FILTERING_LOGIC, filters: [] }),
      loadPage: jest.fn(),
      changePagingOptions: jest.fn(),
      changeFiltering: jest.fn(),
      changeSorting: jest.fn(),
      changeSelectedResources: jest.fn(),
      showRemovalsConfirmation: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }])],
      providers: [UsersComponent, { provide: UsersFacade, useValue: facade }]
    });
  });

  beforeEach(() => {
    component = TestBed.inject(UsersComponent);
    router = TestBed.inject(Router);

    users = createPersistentUsers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits load users page action two times when refreshing the page', () => {
    component.onRefreshPageSelected();

    expect(facade.loadPage).toHaveBeenCalledTimes(1);
    expect(facade.loadPage).toHaveBeenCalledWith();
  });

  it('emits set users page size action when setting the page size', () => {
    const pagingOptions: PagingOptions = { page: 2, pageSize: 5 };

    component.onPageOptionsChanged(pagingOptions);

    expect(facade.changePagingOptions).toHaveBeenCalledWith({ pagingOptions });
  });

  it('emits change users filtering action when filtering', () => {
    const filteringOptions: FilteringOptions = {
      logic: DEFAULT_FILTERING_LOGIC,
      filters: []
    };

    component.onFilteringChanged(filteringOptions);

    expect(facade.changeFiltering).toHaveBeenCalledWith({ filteringOptions });
  });

  it('emits change users sorting action when sorting', () => {
    const sortingOptions: SortingField[] = [{ field: 'email', direction: SortingDirection.DESCENDING }];

    component.onSortingChanged(sortingOptions);

    expect(facade.changeSorting).toHaveBeenCalledWith({
      sortingOptions: { [sortingOptions[0].field]: sortingOptions[0] }
    });
  });

  it('emits change selected users action when selecting rows', () => {
    const selectedResourceIds: string[] = users.map(user => user.id);

    component.onRowSelected(users);

    expect(facade.changeSelectedResources).toHaveBeenCalledWith({ selectedResourceIds });
  });

  it('emits navigate action when clicking a cell', () => {
    jest.spyOn(router, 'navigate');

    component.onRowClicked(users[0]);

    expect(router.navigate).toHaveBeenCalledWith([USERS_RESOURCE_BASE_PATH, users[0].id]);
  });
});
