import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FilteringOptions, PagingOptions, SortingField, SortingOptions } from '@ngdux/data-model-common';

@Directive()
export abstract class AbstractTableComponent<T> {
  @Input() totalCount: number;
  @Input() sortingOptions: SortingOptions;
  @Input() filteringOptions: FilteringOptions;
  @Input() pagingOptions: PagingOptions;
  @Input() gridData: T[];
  @Input() selectedItems: T[];

  @Output() sortingChanged = new EventEmitter<SortingOptions>();
  @Output() filteringChanged = new EventEmitter<FilteringOptions>();
  @Output() refreshPageSelected = new EventEmitter<void>();
  @Output() pageOptionsChanged = new EventEmitter<PagingOptions>();
  @Output() rowSelected = new EventEmitter<T[]>();
  @Output() deleteSelected = new EventEmitter<void>();

  onSortingChanged(sortingField: SortingField): void {
    if (sortingField.direction) {
      this.sortingChanged.emit({ [sortingField.field]: sortingField });
    } else {
      this.sortingChanged.emit({});
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

  onDelete(): void {
    this.deleteSelected.emit();
  }

  onRowSelected(selectedItems: T[]): void {
    this.rowSelected.emit(selectedItems);
  }
}
