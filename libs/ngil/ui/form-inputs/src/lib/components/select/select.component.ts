import { AsyncPipe } from '@angular/common';
import { Component, Input, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgilOverlayComponent, NgilOverlayToggleDirective } from '@ngil/components';
import { AbstractInputComponent } from '@ngil/form-cva';
import { NgilSelectOptionsComponent } from '../select-options/select-options.component';

@Component({
  selector: 'ngil-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgilSelectComponent),
      multi: true,
    },
  ],
  imports: [NgilOverlayComponent, NgilOverlayToggleDirective, NgilSelectOptionsComponent, AsyncPipe],
})
export class NgilSelectComponent<T> extends AbstractInputComponent<T | T[]> {
  @ViewChild(NgilOverlayComponent) overlay?: NgilOverlayComponent;
  @Input() multiple = false;
  @Input() items: T[] = [];
  @Input() displayKey?: keyof T;

  value: T | T[] | null = null;

  get displayValue() {
    if (Array.isArray(this.value)) {
      return this.value.map(item => (this.displayKey ? item[this.displayKey] : item)).join(',');
    }

    if (this.value && this.displayKey) {
      return this.value[this.displayKey];
    }

    return this.value;
  }

  writeValue(value: T): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  onItemSelected(item: T | T[]) {
    this.value = item;

    if (!this.multiple) {
      this.overlay?.close();
    }

    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      this.overlay?.open();
    } else if (event.key === 'Escape') {
      this.overlay?.close();
    }
  }

  isArray(item: T | T[]): item is T[] {
    return Array.isArray(item);
  }
}
