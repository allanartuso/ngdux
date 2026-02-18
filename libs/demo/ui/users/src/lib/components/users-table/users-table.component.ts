import { Component } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { AbstractTableComponent, NgilTableColumn } from '@ngil/list';

@Component({
  selector: 'demo-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  standalone: false,
})
export class UsersTableComponent extends AbstractTableComponent<UserDto> {
  columns: NgilTableColumn[] = [
    { key: 'id', name: 'ID' },
    { key: 'email', name: 'Email' },
    { key: 'firstName', name: 'First Name' },
    { key: 'lastName', name: 'Last Name' },
  ];
}
