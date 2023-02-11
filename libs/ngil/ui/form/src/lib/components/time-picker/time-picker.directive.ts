import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Output
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgilInputComponent } from '../input/input.component';
import { NgilTimePickerOverlayComponent } from '../time-picker-overlay/time-picker-overlay.component';
import { TimePickerValue } from './time-picker.model';

@Directive({
  selector: '[ngilTimePicker]'
})
export class TimePickerDirective implements AfterViewInit, OnDestroy {
  @Input() picker: NgilTimePickerOverlayComponent;

  @Output() changed = new EventEmitter<TimePickerValue>();

  protected readonly destroy$ = new Subject<void>();

  @HostListener('input', ['$event']) onInput = (event: InputEvent): void => {
    const value = (event.target as HTMLInputElement).value;
    this.picker.setValue(value);
  };

  constructor(
    @Optional() private readonly elementRef: ElementRef<HTMLInputElement>,
    @Optional() private readonly inputComponent: NgilInputComponent,
    @Optional() private readonly ngControl?: NgControl
  ) {}

  ngAfterViewInit(): void {
    this.picker.origin = this.elementRef;
    this.picker.valueChanges$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.changed.emit(value);
      this.ngControl?.control.setValue(value);
      const text = `${value.hour}:${value.minute}`;
      if (this.inputComponent) {
        this.inputComponent.value = text;
      }

      this.elementRef.nativeElement.value = text;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
