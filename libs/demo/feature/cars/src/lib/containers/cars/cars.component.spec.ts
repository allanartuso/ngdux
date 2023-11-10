import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CarsFacade } from '@demo/demo/data-access/cars';
import { CarDto, CARS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/cars';
import { createPersistentCars } from '@demo/demo/data-model/cars/test';
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
import { CarsComponent } from './cars.component';

describe('CarsComponent', () => {
  let component: CarsComponent;
  let router: Router;
  let cars: CarDto[];
  let facade: Partial<CarsFacade<CarDto, ErrorDto>>;

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
      providers: [CarsComponent, { provide: CarsFacade, useValue: facade }]
    });
  });

  beforeEach(() => {
    component = TestBed.inject(CarsComponent);
    router = TestBed.inject(Router);

    cars = createPersistentCars();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits load cars page action two times when refreshing the page', () => {
    component.onRefreshPageSelected();

    expect(facade.loadPage).toHaveBeenCalledTimes(1);
    expect(facade.loadPage).toHaveBeenCalledWith();
  });

  it('emits set cars page size action when setting the page size', () => {
    const pagingOptions: PagingOptions = { page: 2, pageSize: 5 };

    component.onPageOptionsChanged(pagingOptions);

    expect(facade.changePagingOptions).toHaveBeenCalledWith({ pagingOptions });
  });

  it('emits change cars filtering action when filtering', () => {
    const filteringOptions: FilteringOptions = {
      logic: DEFAULT_FILTERING_LOGIC,
      filters: []
    };

    component.onFilteringChanged(filteringOptions);

    expect(facade.changeFiltering).toHaveBeenCalledWith({ filteringOptions });
  });

  it('emits change cars sorting action when sorting', () => {
    const sortingOptions: SortingField[] = [{ field: 'email', direction: SortingDirection.DESCENDING }];

    component.onSortingChanged(sortingOptions);

    expect(facade.changeSorting).toHaveBeenCalledWith({
      sortingOptions: { [sortingOptions[0].field]: sortingOptions[0] }
    });
  });

  it('emits change selected cars action when selecting rows', () => {
    const selectedResourceIds: string[] = cars.map(user => user.id);

    component.onRowSelected(cars);

    expect(facade.changeSelectedResources).toHaveBeenCalledWith({ selectedResourceIds });
  });

  it('emits navigate action when clicking a cell', () => {
    jest.spyOn(router, 'navigate');

    component.onRowClicked(cars[0]);

    expect(router.navigate).toHaveBeenCalledWith([CARS_RESOURCE_BASE_PATH, cars[0].id]);
  });
});
