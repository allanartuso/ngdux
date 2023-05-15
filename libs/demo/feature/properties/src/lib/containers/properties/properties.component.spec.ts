import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PropertiesFacade } from '@demo/demo/data-access/properties';
import { PROPERTIES_RESOURCE_BASE_PATH, PropertyDto } from '@demo/demo/data-model/properties';
import { createPersistentProperties } from '@demo/demo/data-model/properties/test';
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
import { PropertiesComponent } from './properties.component';

describe('PropertiesComponent', () => {
  let component: PropertiesComponent;
  let facade: Partial<PropertiesFacade>;
  let router: Router;
  let properties: PropertyDto[];

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
      declarations: [],
      providers: [PropertiesComponent, { provide: PropertiesFacade, useValue: facade }]
    });
  });

  beforeEach(() => {
    component = TestBed.inject(PropertiesComponent);
    router = TestBed.inject(Router);

    properties = createPersistentProperties();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits load properties page action two times when refreshing the page', () => {
    component.onRefreshPageSelected();

    expect(facade.loadPage).toHaveBeenCalledTimes(1);
    expect(facade.loadPage).toHaveBeenCalledWith();
  });

  it('emits set properties page size action when setting the page size', () => {
    const pagingOptions: PagingOptions = { page: 2, pageSize: 5 };

    component.onPageOptionsChanged(pagingOptions);

    expect(facade.changePagingOptions).toHaveBeenCalledWith({ pagingOptions });
  });

  it('emits change properties filtering action when filtering', () => {
    const filteringOptions: FilteringOptions = {
      logic: DEFAULT_FILTERING_LOGIC,
      filters: []
    };

    component.onFilteringChanged(filteringOptions);

    expect(facade.changeFiltering).toHaveBeenCalledWith({ filteringOptions });
  });

  it('emits change properties sorting action when sorting', () => {
    const sortingOptions: SortingField[] = [{ field: 'email', direction: SortingDirection.DESCENDING }];

    component.onSortingChanged(sortingOptions);

    expect(facade.changeSorting).toHaveBeenCalledWith({
      sortingOptions: { [sortingOptions[0].field]: sortingOptions[0] }
    });
  });

  it('emits change selected properties action when selecting rows', () => {
    const selectedResourceIds: string[] = properties.map(property => property.id);

    component.onRowSelected(properties);

    expect(facade.changeSelectedResources).toHaveBeenCalledWith({ selectedResourceIds });
  });

  it('emits navigate action when clicking a cell', () => {
    jest.spyOn(router, 'navigate');

    component.onRowClicked(properties[0]);

    expect(router.navigate).toHaveBeenCalledWith([PROPERTIES_RESOURCE_BASE_PATH, properties[0].id]);
  });
});
