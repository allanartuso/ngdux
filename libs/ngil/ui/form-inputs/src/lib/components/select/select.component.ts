import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Optional,
  ViewChild,
  forwardRef
} from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgilOverlayComponent, NgilOverlayToggleDirective } from '@ngil/components';
import { AbstractInputComponent, NgilErrorMessagesService } from '@ngil/form-cva';
import { NgilSelectOptionsComponent } from '../select-options/select-options.component';

@Component({
  selector: 'ngil-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgilOverlayComponent, NgilOverlayToggleDirective, NgilSelectOptionsComponent, AsyncPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgilSelectComponent),
      multi: true
    }
  ]
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

  constructor(
    private readonly cdr: ChangeDetectorRef,
    errorMessagesService: NgilErrorMessagesService,
    @Optional() controlContainer?: ControlContainer
  ) {
    super(errorMessagesService, controlContainer);
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

  isArray(item: T | T[]): item is T[] {
    return Array.isArray(item);
  }
}
