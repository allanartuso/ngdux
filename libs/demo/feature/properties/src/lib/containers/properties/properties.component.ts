import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesFacade } from '@demo/demo/data-access/properties';
import { PROPERTIES_RESOURCE_BASE_PATH, PropertyDto } from '@demo/demo/data-model/properties';
import { NotificationService } from '@demo/shared/common/util-notification';
import { FilteringOptions, PagingOptions, SortingField } from '@ngil/list';
import { combineLatest, filter, map } from 'rxjs';

@Component({
  selector: 'demo-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  model$ = combineLatest({
    resources: this.propertiesFacade.currentPageData$,
    totalCount: this.propertiesFacade.totalCount$,
    pagingOptions: this.propertiesFacade.pagingOptions$,
    sortingOptions: this.propertiesFacade.sortingOptions$.pipe(map(sortingOptions => Object.values(sortingOptions))),
    filteringOptions: this.propertiesFacade.filteringOptions$,
    selectedItems: this.propertiesFacade.selectedItems$
  });

  constructor(
    private readonly router: Router,
    private readonly propertiesFacade: PropertiesFacade,
    private readonly notificationService: NotificationService
  ) {}

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.propertiesFacade.changeFiltering({ filteringOptions });
  }

  onSortingChanged(sortingOptions: SortingField[]): void {
    this.propertiesFacade.changeSorting({
      sortingOptions
    });
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

  onRowClicked(property: PropertyDto): void {
    this.router.navigate([PROPERTIES_RESOURCE_BASE_PATH, property.id]);
  }

  onDelete(items: PropertyDto[]): void {
    this.notificationService
      .openConfirmationDialog({
        title: 'Delete properties',
        message: 'Are you sure to delete the selected properties?'
      })
      .pipe(filter(confirmed => confirmed))
      .subscribe(() => {
        this.propertiesFacade.delete({ resourceIds: items.map(item => item.id) });
      });
  }
}
