import { ChangeDetectionStrategy, Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { NgilTimePickerOverlayComponent } from './time-picker-overlay.component';

@Component({
  selector: 'ngil-picker-toggle',
  templateUrl: 'picker-toggle.html',
  styleUrls: ['picker-toggle.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerToggleComponent {
  @Input() picker: NgilTimePickerOverlayComponent | undefined;

  @HostListener('click', ['$event']) onClick = (event: Event) => {
    if (!this.picker?.isOpen) {
      this.picker?.open();
    }
    event.stopPropagation();
  };
}
