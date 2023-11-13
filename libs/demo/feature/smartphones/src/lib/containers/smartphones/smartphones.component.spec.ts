import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SmartphonesListFacade } from '@demo/demo/data-access/smartphones';
import { SMARTPHONES_RESOURCE_BASE_PATH, SmartphoneDto } from '@demo/demo/data-model/smartphones';
import { createPersistentSmartphones } from '@demo/demo/data-model/smartphones/test';
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
import { SmartphonesComponent } from './smartphones.component';

describe('SmartphonesComponent', () => {
  let component: SmartphonesComponent;
  let router: Router;
  let smartphones: SmartphoneDto[];
  let facade: Partial<SmartphonesListFacade>;

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
      providers: [SmartphonesComponent, { provide: SmartphonesListFacade, useValue: facade }]
    });
  });

  beforeEach(() => {
    component = TestBed.inject(SmartphonesComponent);
    router = TestBed.inject(Router);

    smartphones = createPersistentSmartphones();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits load smartphones page action two times when refreshing the page', () => {
    component.onRefreshPageSelected();

    expect(facade.loadPage).toHaveBeenCalledTimes(1);
    expect(facade.loadPage).toHaveBeenCalledWith();
  });

  it('emits set smartphones page size action when setting the page size', () => {
    const pagingOptions: PagingOptions = { page: 2, pageSize: 5 };

    component.onPageOptionsChanged(pagingOptions);

    expect(facade.changePagingOptions).toHaveBeenCalledWith({ pagingOptions });
  });

  it('emits change smartphones filtering action when filtering', () => {
    const filteringOptions: FilteringOptions = {
      logic: DEFAULT_FILTERING_LOGIC,
      filters: []
    };

    component.onFilteringChanged(filteringOptions);

    expect(facade.changeFiltering).toHaveBeenCalledWith({ filteringOptions });
  });

  it('emits change smartphones sorting action when sorting', () => {
    const sortingOptions: SortingField[] = [{ field: 'email', direction: SortingDirection.DESCENDING }];

    component.onSortingChanged(sortingOptions);

    expect(facade.changeSorting).toHaveBeenCalledWith({
      sortingOptions: { [sortingOptions[0].field]: sortingOptions[0] }
    });
  });

  it('emits change selected smartphones action when selecting rows', () => {
    const selectedResourceIds: string[] = smartphones.map(user => user.id);

    component.onRowSelected(smartphones);

    expect(facade.changeSelectedResources).toHaveBeenCalledWith({ selectedResourceIds });
  });

  it('emits navigate action when clicking a cell', () => {
    jest.spyOn(router, 'navigate');

    component.onRowClicked(smartphones[0]);

    expect(router.navigate).toHaveBeenCalledWith([SMARTPHONES_RESOURCE_BASE_PATH, smartphones[0].id]);
  });
});
