import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@ngil/form-cva';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'ngil-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgilTextareaComponent),
      multi: true
    }
  ]
})
export class NgilTextareaComponent extends AbstractInputComponent<string> implements AfterViewInit {
  control = new FormControl();

  ngAfterViewInit() {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChangeInput(value);
    });
  }

  writeValue(value: string): void {
    this.control.setValue(value);
  }

  onChangeInput(value: string): void {
    if (this.onChange) {
      this.onChange(value);
    }
  }
}
