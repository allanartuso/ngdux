import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgilOverlayComponent, NgilOverlayToggleDirective } from '@ngil/components';
import { NgilInputComponent } from './components/input/input.component';
import { NgilSelectOptionsComponent } from './components/select-options/select-options.component';
import { NgilSelectComponent } from './components/select/select.component';
import { NgilTextareaComponent } from './components/textarea/textarea.component';
import { PickerToggleComponent } from './components/time-picker-overlay/picker-toggle';
import { NgilTimePickerOverlayComponent } from './components/time-picker-overlay/time-picker-overlay.component';
import { NgilTimePickerComponent } from './components/time-picker/time-picker.component';
import { TimePickerDirective } from './components/time-picker/time-picker.directive';
import { NumberRotationDirective } from './directives/number-rotation.directive';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, NgilOverlayToggleDirective, NgilOverlayComponent],
  declarations: [
    NgilInputComponent,
    NgilTimePickerComponent,
    NgilTimePickerOverlayComponent,
    PickerToggleComponent,
    NumberRotationDirective,
    TimePickerDirective,
    NgilSelectComponent,
    NgilTextareaComponent,
    NgilSelectOptionsComponent
  ],
  exports: [
    NgilInputComponent,
    NgilSelectComponent,
    NgilTextareaComponent,
    NgilTimePickerComponent,
    NgilTimePickerOverlayComponent,
    PickerToggleComponent,
    NumberRotationDirective,
    TimePickerDirective
  ]
})
export class NgilUiFormModule {}
