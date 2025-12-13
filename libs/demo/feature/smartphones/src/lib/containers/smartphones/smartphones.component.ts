import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SmartphonesListFacade } from '@demo/demo/data-access/smartphones';
import { SmartphoneDto, SMARTPHONES_RESOURCE_BASE_PATH } from '@demo/demo/data-model/smartphones';
import { FilteringOptions, PagingOptions, SortingField } from '@ngdux/data-model-common';
import { combineLatest, map } from 'rxjs';

@Component({
    selector: 'demo-smartphones',
    templateUrl: './smartphones.component.html',
    styleUrls: ['./smartphones.component.scss'],
    standalone: false
})
export class SmartphonesComponent {
  model$ = combineLatest({
    smartphones: this.smartphonesFacade.currentPageData$,
    totalCount: this.smartphonesFacade.totalCount$,
    pagingOptions: this.smartphonesFacade.pagingOptions$,
    sortingOptions: this.smartphonesFacade.sortingOptions$.pipe(map(sortingOptions => Object.values(sortingOptions))),
    filteringOptions: this.smartphonesFacade.filteringOptions$,
    selectedItems: this.smartphonesFacade.selectedItems$
  });

  constructor(private readonly router: Router, private readonly smartphonesFacade: SmartphonesListFacade) {}

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.smartphonesFacade.changeFiltering({ filteringOptions });
  }

  onSortingChanged(sortingOptions: SortingField[]): void {
    this.smartphonesFacade.changeSorting({
      sortingOptions
    });
  }

  onPageOptionsChanged(pagingOptions: PagingOptions): void {
    this.smartphonesFacade.changePagingOptions({ pagingOptions });
  }

  onRefreshPageSelected(): void {
    this.smartphonesFacade.loadPage();
  }

  onRowSelected(smartphones: SmartphoneDto[]): void {
    this.smartphonesFacade.changeSelectedResources({ selectedResourceIds: smartphones.map(user => user.id) });
  }

  onRowClicked(user: SmartphoneDto): void {
    this.router.navigate([SMARTPHONES_RESOURCE_BASE_PATH, user.id]);
  }
}
