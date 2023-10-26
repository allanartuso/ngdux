import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmationDialogComponent, { provide: MAT_DIALOG_DATA, useValue: {} }],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    component = TestBed.inject(ConfirmationDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
