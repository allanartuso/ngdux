import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CarsListFacade } from '@demo/demo/data-access/cars';
import { CarDto, CARS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/cars';
import { FilteringOptions, PagingOptions, SortingField } from '@ngdux/data-model-common';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'demo-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
  standalone: false
})
export class CarsComponent {
  private readonly router = inject(Router);
  private readonly carsFacade = inject(CarsListFacade);

  model$ = combineLatest({
    cars: this.carsFacade.currentPageData$,
    totalCount: this.carsFacade.totalCount$,
    pagingOptions: this.carsFacade.pagingOptions$,
    sortingOptions: this.carsFacade.sortingOptions$.pipe(map(sortingOptions => Object.values(sortingOptions))),
    filteringOptions: this.carsFacade.filteringOptions$,
    selectedItems: this.carsFacade.selectedItems$
  });

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.carsFacade.changeFiltering({ filteringOptions });
  }

  onSortingChanged(sortingOptions: SortingField[]): void {
    this.carsFacade.changeSorting({
      sortingOptions
    });
  }

  onPageOptionsChanged(pagingOptions: PagingOptions): void {
    this.carsFacade.changePagingOptions({ pagingOptions });
  }

  onRefreshPageSelected(): void {
    this.carsFacade.loadPage();
  }

  onRowSelected(cars: CarDto[]): void {
    this.carsFacade.changeSelectedResources({ selectedResourceIds: cars.map(user => user.id) });
  }

  onRowClicked(car: CarDto): void {
    this.router.navigate([CARS_RESOURCE_BASE_PATH, car.id]);
  }
}
