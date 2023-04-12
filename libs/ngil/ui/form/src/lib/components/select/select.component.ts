import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AbstractInputComponent } from '../../models/abstract-input-component';

@Component({
  selector: 'ngil-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgilSelectComponent),
      multi: true
    }
  ]
})
export class NgilSelectComponent<T> extends AbstractInputComponent<T> implements AfterViewInit {
  @Input() multiple = false;
  @Input() items: T[] = [];
  @Input() displayKey?: keyof T;

  control = new FormControl();

  ngAfterViewInit() {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChangeInput(value);
    });
  }

  writeValue(value: T): void {
    this.control.setValue(value);
  }

  onChangeInput(selection: T[]): void {
    let newValue: T | T[] = selection;
    if (!this.multiple) {
      newValue = selection[0];
    }
    if (this.onChange) {
      this.onChange(newValue as any);
    }
  }
}
