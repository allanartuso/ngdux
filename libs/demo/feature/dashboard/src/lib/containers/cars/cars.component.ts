import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarsFacade } from '@demo/demo/data-access/cars';
import { CarDto, CARS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/cars';
import { ErrorDto, FilteringOptions, PagingOptions, SortingField, SortingOptions } from '@ngdux/data-model-common';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'demo-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent {
  model$ = combineLatest({
    cars: this.carsFacade.currentPageData$,
    totalCount: this.carsFacade.totalCount$,
    pagingOptions: this.carsFacade.pagingOptions$,
    sortingOptions: this.carsFacade.sortingOptions$.pipe(map(sortingOptions => Object.values(sortingOptions))),
    filteringOptions: this.carsFacade.filteringOptions$,
    selectedItems: this.carsFacade.selectedItems$
  });

  isReady$ = this.carsFacade.isReady$;

  constructor(private readonly router: Router, private readonly carsFacade: CarsFacade<CarDto, ErrorDto>) {
    this.carsFacade.initialize();
  }

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.carsFacade.changeFiltering({ filteringOptions });
  }

  onSortingChanged(sortingOptions: SortingField[]): void {
    this.carsFacade.changeSorting({
      sortingOptions: sortingOptions.reduce<SortingOptions>((acc, sortingOption) => {
        return { ...acc, [sortingOption.field]: sortingOption };
      }, {})
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

  onRowClicked(user: CarDto): void {
    this.router.navigate([CARS_RESOURCE_BASE_PATH, user.id]);
  }

  onDelete(): void {
    this.carsFacade.showRemovalsConfirmation();
  }
}
