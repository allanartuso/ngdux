import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgilInputComponent } from './components/input/input.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NgilInputComponent],
  exports: [NgilInputComponent]
})
export class NgilUiFormModule {}
