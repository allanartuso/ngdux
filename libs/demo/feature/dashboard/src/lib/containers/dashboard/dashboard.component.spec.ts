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
  ErrorDto
} from '@ngdux/data-model-common';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';

describe('CarsComponent', () => {
  let component: DashboardComponent;
  let router: Router;
  let dashboard: CarDto[];
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
      providers: [DashboardComponent, { provide: CarsFacade, useValue: facade }]
    });
  });

  beforeEach(() => {
    component = TestBed.inject(DashboardComponent);
    router = TestBed.inject(Router);

    dashboard = createPersistentCars();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits navigate action when clicking a cell', () => {
    jest.spyOn(router, 'navigate');

    component.onRowClicked(dashboard[0]);

    expect(router.navigate).toHaveBeenCalledWith([CARS_RESOURCE_BASE_PATH, dashboard[0].id]);
  });
});
