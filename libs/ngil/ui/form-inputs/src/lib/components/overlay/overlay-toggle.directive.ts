import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgilOverlayComponent } from './overlay.component';

@Directive({
  selector: '[ngilOverlayToggle]',
  exportAs: 'ngilOverlayToggle'
})
export class OverlayToggleDirective implements OnInit {
  @Input() set ngilOverlayToggle(overlay: NgilOverlayComponent) {
    this.overlay = overlay;
  }
  private overlay: NgilOverlayComponent | undefined;

  @Input() set isOverlayOrigin(isOrigin: boolean) {
    this.isOrigin = isOrigin;
    this.setOverlayOrigin();
  }
  private isOrigin = true;

  constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  ngOnInit(): void {
    this.setOverlayOrigin();
  }

  private setOverlayOrigin(): void {
    if (this.isOrigin && this.overlay) {
      this.overlay.origin = this.elementRef;
    } else if (this.overlay) {
      this.overlay.origin = undefined;
    }
  }

  @HostListener('click', ['$event']) onClick = (event: Event): void => {
    if (!this.overlay) {
      throw new Error(`The overlay is not defined. The overlay component should be provided in the directive input

        <my-element [ngilOverlayToggle]="overlay"></my-element>
        <ngil-overlay #overlay>...</ngil-overlay>
      `);
    }

    if (!this.overlay.isOpened) {
      this.overlay.open();
    }

    event.stopPropagation();
  };
}
