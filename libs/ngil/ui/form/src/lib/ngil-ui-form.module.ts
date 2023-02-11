import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgilInputComponent } from './components/input/input.component';
import { PickerToggleComponent } from './components/time-picker-overlay/picker-toggle';
import { NgilTimePickerOverlayComponent } from './components/time-picker-overlay/time-picker-overlay.component';
import { NgilTimePickerComponent } from './components/time-picker/time-picker.component';
import { TimePickerDirective } from './components/time-picker/time-picker.directive';
import { NumberRotationDirective } from './pipes/number-rotation.directive';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, OverlayModule],
  declarations: [
    NgilInputComponent,
    NgilTimePickerComponent,
    NgilTimePickerOverlayComponent,
    PickerToggleComponent,
    NumberRotationDirective,
    TimePickerDirective
  ],
  exports: [
    NgilInputComponent,
    NgilTimePickerComponent,
    NgilTimePickerOverlayComponent,
    PickerToggleComponent,
    NumberRotationDirective,
    TimePickerDirective
  ]
})
export class NgilUiFormModule {}
