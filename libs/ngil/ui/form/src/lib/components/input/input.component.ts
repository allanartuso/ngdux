import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { AbstractInputComponent } from '../../models/abstract-input-component';

@Component({
  selector: 'ngil-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgilInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgilInputComponent extends AbstractInputComponent<string | number> implements AfterViewInit {
  @Input() type = 'text';
  // @Input() inputTemplate: TemplateRef<any>;

  // @ContentChild('contentParagraph', {static: true}) paragraph : ElementRef;
  control = new FormControl();

  ngAfterViewInit() {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChangeInput(value);
    });
  }

  writeValue(value: string | number): void {
    this.control.setValue(value);
  }

  onChangeInput(value: string | number): void {
    if (this.type === 'number') {
      value = +value;
    }
    if (this.onChange) {
      this.onChange(value);
    }
  }
}
