import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgilOverlayComponent, NgilOverlayToggleDirective } from '@ngil/components';
import { NgilInputComponent } from './components/input/input.component';
import { NgilRadioComponent } from './components/radio/radio.component';
import { NgilSelectOptionsComponent } from './components/select-options/select-options.component';
import { NgilSelectComponent } from './components/select/select.component';
import { NgilTextareaComponent } from './components/textarea/textarea.component';
import { NgilPickerToggleComponent } from './components/time-picker-overlay/picker-toggle';
import { NgilTimePickerOverlayComponent } from './components/time-picker-overlay/time-picker-overlay.component';
import { NgilTimePickerComponent } from './components/time-picker/time-picker.component';
import { NgilTimePickerDirective } from './components/time-picker/time-picker.directive';
import { NumberRotationDirective } from './directives/number-rotation.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgilOverlayToggleDirective,
    NgilOverlayComponent,
    NgilRadioComponent,
    NgilPickerToggleComponent,
    NgilSelectComponent,
    NgilSelectOptionsComponent,
    NgilTimePickerDirective,
    NgilTimePickerOverlayComponent,
    NgilInputComponent,
  ],
  declarations: [NgilTimePickerComponent, NumberRotationDirective, NgilTextareaComponent],
  exports: [
    NgilInputComponent,
    NgilRadioComponent,
    NgilSelectComponent,
    NgilTextareaComponent,
    NgilTimePickerComponent,
    NgilTimePickerOverlayComponent,
    NgilPickerToggleComponent,
    NumberRotationDirective,
    NgilTimePickerDirective,
  ],
})
export class NgilUiFormModule {}
