import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgilOverlayDirective } from '../../directives/overlay.directive';
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
export class NgilSelectComponent<T> extends AbstractInputComponent<T | T[]> {
  @ViewChild(NgilOverlayDirective) overlay?: NgilOverlayDirective;
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

  isArray(item: T | T[]): item is T[] {
    return Array.isArray(item);
  }

  toggleOverlay() {
    if (!this.readonly && !this.disabled) {
      this.overlay?.toggle();
    }
  }
}
