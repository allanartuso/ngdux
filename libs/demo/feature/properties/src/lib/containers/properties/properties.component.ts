import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesFacade } from '@demo/demo/data-access/properties';
import { PROPERTIES_RESOURCE_BASE_PATH, PropertyDto } from '@demo/demo/data-model/properties';
import { FilteringOptions, PagingOptions, SortingOptions } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  resources$: Observable<PropertyDto[]> = this.propertiesFacade.currentPageData$;
  totalCount$: Observable<number> = this.propertiesFacade.totalCount$;
  pagingOptions$: Observable<PagingOptions> = this.propertiesFacade.pagingOptions$;
  sortingOptions$: Observable<SortingOptions> = this.propertiesFacade.sortingOptions$;
  filteringOptions$: Observable<FilteringOptions> = this.propertiesFacade.filteringOptions$;
  selectedItems$: Observable<PropertyDto[]> = this.propertiesFacade.selectedItems$;

  constructor(private readonly router: Router, private readonly propertiesFacade: PropertiesFacade) {}

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.propertiesFacade.changeFiltering({ filteringOptions });
  }

  onSortingChanged(sortingOptions: SortingOptions): void {
    this.propertiesFacade.changeSorting({ sortingOptions });
  }

  onPageOptionsChanged(pagingOptions: PagingOptions): void {
    this.propertiesFacade.changePagingOptions({ pagingOptions });
  }

  onRefreshPageSelected(): void {
    this.propertiesFacade.loadPage();
  }

  onRowSelected(properties: PropertyDto[]): void {
    this.propertiesFacade.changeSelectedResources({ selectedResourceIds: properties.map(user => user.id) });
  }

  onCellSelected(resourceId: string): void {
    this.router.navigate([PROPERTIES_RESOURCE_BASE_PATH, resourceId]);
  }

  onDelete(): void {
    this.propertiesFacade.showRemovalsConfirmation();
  }
}
