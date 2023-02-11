import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { AbstractInputComponent } from '../../models/abstract-input-component';
import { TimePickerValue } from './time-picker.model';

@Component({
  selector: 'ngil-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NgilTimePickerComponent,
      multi: true
    }
  ]
})
export class NgilTimePickerComponent extends AbstractInputComponent<TimePickerValue> implements AfterViewInit {
  private defaultValue: TimePickerValue = { hour: 0, minute: 0, second: 0 };

  value: string;
  formGroup = new FormGroup({
    hour: new FormControl(this.defaultValue.hour),
    minute: new FormControl(this.defaultValue.minute),
    second: new FormControl(this.defaultValue.second)
  });

  ngAfterViewInit(): void {
    this.listenValueChanges();
  }

  protected listenValueChanges(): void {
    this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.onChange) {
        this.onChange(this.formGroup.getRawValue());
      }
    });
  }

  writeValue(value: TimePickerValue): void {
    if (value) {
      this.formGroup.setValue(
        {
          ...this.defaultValue,
          ...value
        },
        { emitEvent: false }
      );
    } else {
      this.formGroup.reset(this.defaultValue, { emitEvent: false });
    }
  }
}
