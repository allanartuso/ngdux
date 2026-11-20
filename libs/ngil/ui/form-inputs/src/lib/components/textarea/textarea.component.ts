import { AfterViewInit, Component, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@ngil/form-cva';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'ngil-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgilTextareaComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class NgilTextareaComponent extends AbstractInputComponent<string> implements AfterViewInit {
  control = new FormControl();

  ngAfterViewInit() {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChangeInput(value);
    });
  }

  protected override get disabledStateControl() {
    return this.control;
  }

  writeValue(value: string): void {
    this.control.setValue(value, { emitEvent: false });
    this.cdr.markForCheck();
  }

  onChangeInput(value: string): void {
    if (this.onChange) {
      this.onChange(value);
    }
  }
}
