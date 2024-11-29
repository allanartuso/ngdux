import { Directive, EventEmitter, Input, Output } from '@angular/core';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  FilteringLogic,
  FilteringOptions,
  PagingOptions,
  SortingField
} from '@ngdux/data-model-common';

@Directive()
export abstract class AbstractTableComponent<T> {
  @Input() totalCount = 0;
  @Input() sortingOptions: SortingField[] = [];
  @Input() filteringOptions: FilteringOptions = {
    filters: [],
    logic: FilteringLogic.AND
  };
  @Input() pagingOptions: PagingOptions = {
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE
  };
  @Input() gridData: T[] = [];
  @Input() selectedItems: T[] = [];
  @Input() canEdit = false;
  @Input() allowRowSelection = false;
  @Input() loading = false;

  @Output() sortingChanged = new EventEmitter<SortingField[]>();
  @Output() filteringChanged = new EventEmitter<FilteringOptions>();
  @Output() refreshPageSelected = new EventEmitter<void>();
  @Output() pageOptionsChanged = new EventEmitter<PagingOptions>();
  @Output() rowSelected = new EventEmitter<T[]>();
  @Output() rowClicked = new EventEmitter<T>();
  @Output() deleteSelected = new EventEmitter<T[]>();

  onSortingChanged(sortingField: SortingField): void {
    if (sortingField.direction) {
      this.sortingChanged.emit([sortingField]);
    } else {
      this.sortingChanged.emit([]);
    }
  }

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.filteringChanged.emit(filteringOptions);
  }

  onRefreshPageSelected(): void {
    this.refreshPageSelected.emit();
  }

  onPageOptionsChanged(pagingOptions: PagingOptions): void {
    this.pageOptionsChanged.emit(pagingOptions);
  }

  onDelete(selectedItems: T[]): void {
    this.deleteSelected.emit(selectedItems);
  }

  onRowSelected(selectedItems: T[]): void {
    this.rowSelected.emit(selectedItems);
  }

  onRowClicked(item: T): void {
    this.rowClicked.emit(item);
  }
}
