import { TestBed } from '@angular/core/testing';
import { UsersTableComponent } from './users-table.component';

describe('UsersListComponent', () => {
  let component: UsersTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersTableComponent]
    });
    component = TestBed.inject(UsersTableComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
