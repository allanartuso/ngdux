import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersFacade } from '@demo/demo/data-access/users';
import { UserDto, USERS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/users';
import { FilteringOptions, PagingOptions, SortingField, SortingOptions } from '@ngdux/data-model-common';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'demo-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  $model = combineLatest({
    users: this.usersFacade.currentPageData$,
    totalCount: this.usersFacade.totalCount$,
    pagingOptions: this.usersFacade.pagingOptions$,
    sortingOptions: this.usersFacade.sortingOptions$.pipe(map(sortingOptions => Object.values(sortingOptions))),
    filteringOptions: this.usersFacade.filteringOptions$,
    selectedItems: this.usersFacade.selectedItems$
  });

  constructor(private readonly router: Router, private readonly usersFacade: UsersFacade) {}

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.usersFacade.changeFiltering({ filteringOptions });
  }

  onSortingChanged(sortingOptions: SortingField[]): void {
    this.usersFacade.changeSorting({
      sortingOptions: sortingOptions.reduce<SortingOptions>((acc, sortingOption) => {
        return { ...acc, [sortingOption.field]: sortingOption };
      }, {})
    });
  }

  onPageOptionsChanged(pagingOptions: PagingOptions): void {
    this.usersFacade.changePagingOptions({ pagingOptions });
  }

  onRefreshPageSelected(): void {
    this.usersFacade.loadPage();
  }

  onRowSelected(users: UserDto[]): void {
    this.usersFacade.changeSelectedResources({ selectedResourceIds: users.map(user => user.id) });
  }

  onRowClicked(user: UserDto): void {
    this.router.navigate([USERS_RESOURCE_BASE_PATH, user.id]);
  }

  onDelete(): void {
    this.usersFacade.showRemovalsConfirmation();
  }
}
