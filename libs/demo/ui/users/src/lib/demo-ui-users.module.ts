import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { NgilUiFormModule } from '@ngil/form-inputs';
import { NgilTableComponent } from '@ngil/list';
import { UsersTableComponent } from './components/users-table/users-table.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedUiFormModule, NgilUiFormModule, OverlayModule, NgilTableComponent],
  declarations: [UsersTableComponent],
  exports: [UsersTableComponent],
})
export class DemoUiUsersModule {}
