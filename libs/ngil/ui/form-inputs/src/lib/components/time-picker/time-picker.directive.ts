import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { AbstractControl, NgControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgilInputComponent } from '../input/input.component';
import { NgilTimePickerOverlayComponent } from '../time-picker-overlay/time-picker-overlay.component';
import { TimePickerValue } from './time-picker.model';

@Directive({
  selector: '[ngilTimePicker]',
})
export class NgilTimePickerDirective implements AfterViewInit, OnDestroy, OnInit {
  @Input() picker?: NgilTimePickerOverlayComponent;

  @Output() changed = new EventEmitter<TimePickerValue>();

  protected readonly destroy$ = new Subject<void>();

  @HostListener('keydown', ['$event'])
  onKeyDown = (event: KeyboardEvent): void => {
    if (isNaN(+event.key) && event.key !== ':' && event.key.length === 1) {
      event.preventDefault();
    }
  };

  @HostListener('input', ['$event']) onInput = (event: InputEvent): void => {
    this.setPickerValue((event.target as HTMLInputElement).value);
  };

  constructor(
    private readonly elementRef: ElementRef<HTMLInputElement>,
    @Optional() private readonly inputComponent?: NgilInputComponent,
    @Optional() private readonly ngControl?: NgControl,
  ) {}

  ngOnInit(): void {
    this.ngControl?.control?.setValidators([this.timeValidator()]);
    this.setPickerValue(this.ngControl?.control?.value);
  }

  private setPickerValue(value?: string) {
    const parsedValue = this.getTimePickerValue(value);
    this.picker?.setValue({
      hour: +parsedValue.hour,
      minute: +parsedValue.minute || 0,
      second: +parsedValue.second || 0,
    });
  }

  private timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = this.getTimePickerValue(control.value);
      if (this.itemHasError(value.hour, 23)) {
        return {
          invalidHour: true,
        };
      }

      if (this.itemHasError(value.minute, 59)) {
        return {
          invalidMinute: true,
        };
      }

      if (this.itemHasError(value.second, 59)) {
        return {
          invalidSecond: true,
        };
      }

      return null;
    };
  }

  private itemHasError(value: string, max: number, min = 0) {
    if (value && (value.length > 2 || +value > max || +value < min)) {
      return true;
    }

    return false;
  }

  private getTimePickerValue(value: string | null | undefined) {
    const split = value?.split(':');

    return {
      hour: split ? split[0] : '00',
      minute: split ? split[1] : '00',
      second: split ? split[2] : '00',
    };
  }

  ngAfterViewInit(): void {
    if (this.picker) {
      this.picker.origin = this.elementRef;
      this.picker.valueChanges$.pipe(takeUntil(this.destroy$)).subscribe(value => {
        this.setInputText(value);
        this.changed.emit(value);
      });
    }
  }

  private setInputText(value: TimePickerValue): void {
    const text = [this.getItemText(value.hour), this.getItemText(value.minute), this.getItemText(value.second)].join(
      ':',
    );
    this.inputComponent?.control.setValue(text);
    this.elementRef.nativeElement.value = text;
    this.ngControl?.control?.setValue(text);
  }

  private getItemText(value: number) {
    return value.toString().padStart(2, '0');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
