import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from './services/form-notification.service';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatSnackBarModule],
  providers: [NotificationService, { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }],
  declarations: [ConfirmationDialogComponent]
})
export class SharedUtilNotificationModule {}
