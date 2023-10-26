import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgilOverlayComponent } from './overlay.component';

@Directive({
  selector: '[ngilOverlayToggle]',
  exportAs: 'ngilOverlayToggle'
})
export class OverlayToggleDirective {
  @Input() set ngilOverlayToggle(overlay: NgilOverlayComponent) {
    this._overlay = overlay;
    overlay.origin = this.elementRef;
  }
  private _overlay: NgilOverlayComponent | undefined;

  constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener('click', ['$event']) onClick = (event: Event) => {
    if (!this._overlay) {
      throw new Error(`The overlay is not defined. The overlay component should be provided in the directive input

        <my-element [ngilOverlayToggle]="overlay"></my-element>
        <ngil-overlay #overlay>...</ngil-overlay>
      `);
    }

    if (!this._overlay.isOpen) {
      this._overlay.open();
    }

    event.stopPropagation();
  };
}
