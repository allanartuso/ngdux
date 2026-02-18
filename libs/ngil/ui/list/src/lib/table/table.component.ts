import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  FilteringOptions,
  PagingOptions,
  SortingDirection,
  SortingField,
} from '@ngdux/data-model-common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DemoMatPaginatorIntl } from './custom-paginator.service';
import { NgilTableColumn } from './table.model';

@Component({
  selector: 'ngil-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: DemoMatPaginatorIntl }],
})
export class NgilTableComponent<T> implements OnInit, OnDestroy {
  @Input() columns: NgilTableColumn[] = [];
  @Input() totalCount = 0;
  @Input() pageSizeOptions = [5, 10, 20, 30, 50];
  @Input() dataSource: T[] = [];
  @Input() canEdit = false;
  @Input() allowRowSelection = false;
  @Input() set sortingOptions(sortingOptions: SortingField[]) {
    const firstSort = sortingOptions[0];
    this.sortActive = firstSort?.field;
    this.sortDirection = firstSort?.direction;
  }

  @Input() set pagingOptions(pagingOptions: PagingOptions) {
    this.pageNumber = pagingOptions.page;
    this.pageSize = pagingOptions.pageSize;
  }

  @Output() sortingChanged = new EventEmitter<SortingField>();
  @Output() filteringChanged = new EventEmitter<FilteringOptions>();
  @Output() refreshPageSelected = new EventEmitter<void>();
  @Output() pageOptionsChanged = new EventEmitter<PagingOptions>();
  @Output() rowSelected = new EventEmitter<T[]>();
  @Output() deleteSelected = new EventEmitter<T[]>();
  @Output() rowClicked = new EventEmitter<T>();

  sortActive = '';
  sortDirection: SortDirection = 'asc';
  selection = new SelectionModel<T>(true, []);
  pageNumber = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;

  get displayedColumns(): string[] {
    const displayedColumns = [...this.columns.map(column => column.key)];
    if (this.allowRowSelection) {
      displayedColumns.unshift('select');
    }

    return displayedColumns;
  }

  protected readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.selection.changed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.rowSelected.emit(this.selection.selected);
    });
  }

  clearSelection(): void {
    this.selection.clear();
  }

  selectItems(items: T[]): void {
    this.selection.select(...items);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  onSortingChanged(sortingField: Sort): void {
    this.sortingChanged.emit({
      field: sortingField.active,
      direction: sortingField.direction as SortingDirection,
    });
  }

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.filteringChanged.emit(filteringOptions);
  }

  onRefreshPageSelected(): void {
    this.refreshPageSelected.emit();
  }

  onPageEvent(pageEvent: PageEvent): void {
    this.pageOptionsChanged.emit({
      page: pageEvent.pageIndex + 1,
      pageSize: pageEvent.pageSize,
    });
  }

  onDelete(): void {
    this.deleteSelected.emit(this.selection.selected);
  }

  onRowClicked(item: T) {
    this.rowClicked.emit(item);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
