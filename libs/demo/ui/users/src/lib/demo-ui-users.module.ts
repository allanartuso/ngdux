import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { NgilUiFormModule } from '@ngil/form-inputs';
import { UsersTableComponent } from './components/users-table/users-table.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedUiFormModule, SharedUiListModule, NgilUiFormModule, OverlayModule],
  declarations: [UsersTableComponent],
  exports: [UsersTableComponent],
})
export class DemoUiUsersModule {}
