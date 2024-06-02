import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { EllipsisTooltipComponent } from '@ngil/components';
import { NgilUiFormModule } from '@ngil/form-inputs';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersTableComponent } from './components/users-table/users-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiFormModule,
    SharedUiListModule,
    NgilUiFormModule,
    OverlayModule,
    EllipsisTooltipComponent
  ],
  declarations: [UserFormComponent, UsersTableComponent],
  exports: [UserFormComponent, UsersTableComponent]
})
export class DemoUiUsersModule {}
