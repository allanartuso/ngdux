import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
}
@Component({
  selector: 'demo-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
  standalone: false,
})
export class ConfirmationDialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);
}
