import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersListFacade } from '@demo/demo/data-access/users';
import { UserDto, USERS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/users';
import { NotificationService } from '@demo/shared/common/util-notification';
import { FilteringOptions, PagingOptions, SortingField } from '@ngdux/data-model-common';
import { combineLatest, filter, map } from 'rxjs';

@Component({
  selector: 'demo-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: false
})
export class UsersComponent {
  model$ = combineLatest({
    users: this.usersFacade.currentPageData$,
    totalCount: this.usersFacade.totalCount$,
    pagingOptions: this.usersFacade.pagingOptions$,
    sortingOptions: this.usersFacade.sortingOptions$.pipe(map(sortingOptions => Object.values(sortingOptions))),
    filteringOptions: this.usersFacade.filteringOptions$,
    selectedItems: this.usersFacade.selectedItems$
  });

  constructor(
    private readonly router: Router,
    private readonly usersFacade: UsersListFacade,
    private readonly notificationService: NotificationService
  ) {}

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.usersFacade.changeFiltering({ filteringOptions });
  }

  onSortingChanged(sortingOptions: SortingField[]): void {
    this.usersFacade.changeSorting({
      sortingOptions
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

  onDelete(items: UserDto[]): void {
    this.notificationService
      .openConfirmationDialog({
        title: 'Delete users',
        message: 'Are you sure to delete the selected users?'
      })
      .pipe(filter(confirmed => confirmed))
      .subscribe(() => {
        this.usersFacade.delete({ resourceIds: items.map(item => item.id) });
      });
  }
}
