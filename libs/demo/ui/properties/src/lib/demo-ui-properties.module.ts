import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { NgilUiFormModule } from '@ngil/form-inputs';
import { AddressFormComponent } from './address-form/address-form.component';
import { PropertiesTableComponent } from './properties-table/properties-table.component';
import { PropertyFormComponent } from './property-form/property-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiFormModule,
    SharedUiListModule,
    NgilUiFormModule,
    MatSelectModule,
    TextFieldModule,
    MatInputModule,
  ],
  declarations: [PropertyFormComponent, PropertiesTableComponent, AddressFormComponent],
  exports: [PropertyFormComponent, PropertiesTableComponent],
})
export class DemoUiPropertiesModule {}
