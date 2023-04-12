import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { listActions, listSelectors } from '@demo/demo/data-access/users';
import { UserDto, USERS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/users';
import { FilteringOptions, PagingOptions, SortingOptions } from '@ngdux/data-model-common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users$: Observable<UserDto[]> = this.store.pipe(select(listSelectors.getCurrentPageData));
  totalCount$: Observable<number> = this.store.pipe(select(listSelectors.getTotalCount));
  pagingOptions$: Observable<PagingOptions> = this.store.pipe(select(listSelectors.getPagingOptions));
  sortingOptions$: Observable<SortingOptions> = this.store.pipe(select(listSelectors.getSortingOptions));
  filteringOptions$: Observable<FilteringOptions> = this.store.pipe(select(listSelectors.getFilteringOptions));
  selectedItems$: Observable<UserDto[]> = this.store.pipe(select(listSelectors.getSelectedItems));

  constructor(private readonly router: Router, private readonly store: Store) {}

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.store.dispatch(listActions.changeFiltering({ filteringOptions }));
  }

  onSortingChanged(sortingOptions: SortingOptions): void {
    this.store.dispatch(listActions.changeSorting({ sortingOptions }));
  }

  onPageOptionsChanged(pagingOptions: PagingOptions): void {
    this.store.dispatch(listActions.changePagingOptions({ pagingOptions }));
  }

  onRefreshPageSelected(): void {
    this.store.dispatch(listActions.loadPage());
  }

  onRowSelected(users: UserDto[]): void {
    this.store.dispatch(listActions.changeSelectedResources({ selectedResourceIds: users.map(user => user.id) }));
  }

  onCellSelected(resourceId: string): void {
    this.router.navigate([USERS_RESOURCE_BASE_PATH, resourceId]);
  }

  onDelete(): void {
    this.store.dispatch(listActions.showRemovalsConfirmation());
  }
}
