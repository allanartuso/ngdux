# @ngil/list

The @ngil/list provides utilities to paging, sorting and filtering a list. Other than actions as deleting and selecting an item in the list.

## Usage

Run `nx test ngil-ui-list` to execute the unit tests.

list.component.ts

```
import { Component, EventEmitter, Output } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { TableColumn } from '@demo/shared/ui-list';
import { AbstractTableComponent } from '@ngil/list';

@Component({
  selector: 'demo-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class UsersTableComponent extends AbstractTableComponent<UserDto> {
  columns: TableColumn[] = [
    { key: 'id', name: 'ID' },
    { key: 'email', name: 'Email' },
    { key: 'firstName', name: 'First Name' },
    { key: 'lastName', name: 'Last Name' }
  ];
}

```

list.component.html

```
  <table
    mat-table
    matSort
    [dataSource]="dataSource"
    (matSortChange)="onSortingChanged($event)"
    [matSortActive]="sortActive"
    [matSortDirection]="sortDirection"
  >
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns" class="demo-list__row"></tr>

    <ng-container *ngFor="let column of columns">
      <ng-container [matColumnDef]="column.key">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ column.name }}</th>
        <td mat-cell *matCellDef="let element">{{ element[column.key] }}</td>
      </ng-container>
    </ng-container>
  </table>

  <mat-paginator
    [pageSizeOptions]="pageSizeOptions"
    [showFirstLastButtons]="true"
    [pageIndex]="pageNumber - 1"
    [pageSize]="pageSize"
    [length]="totalCount"
    (page)="onPageEvent($event)"
  >
  </mat-paginator>
```
