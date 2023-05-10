import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostBinding, Input, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[ngilOverlay]',
  exportAs: 'ngilOverlay'
})
export class NgilOverlayDirective implements OnDestroy {
  @Input() origin?: HTMLElement;
  @HostBinding('class.hidden') hidden = true;
  isOpen = false;

  protected readonly destroy$ = new Subject<void>();
  private overlayRef?: OverlayRef;

  constructor(private readonly overlay: Overlay, private el: ElementRef) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    const width = this.origin?.offsetWidth;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.getStrategy(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      maxHeight: 300,
      width: width
    });
    const portal = new DomPortal(this.el);
    this.overlayRef.attach(portal);

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.close();
      });

    this.isOpen = true;
  }

  close(): void {
    this.destroyOverlay();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  private destroyOverlay() {
    this.destroy$.next();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.isOpen = false;
  }

  private getStrategy() {
    const primaryX = 'start';
    const secondaryX = primaryX === 'start' ? 'end' : 'start';
    const primaryY = 'top';
    const secondaryY = 'bottom';

    if (!this.origin) {
      return undefined;
    }

    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.origin)
      .withPositions([
        {
          originX: primaryX,
          originY: secondaryY,
          overlayX: primaryX,
          overlayY: primaryY
        },
        {
          originX: primaryX,
          originY: primaryY,
          overlayX: primaryX,
          overlayY: secondaryY
        },
        {
          originX: secondaryX,
          originY: secondaryY,
          overlayX: secondaryX,
          overlayY: primaryY
        },
        {
          originX: secondaryX,
          originY: primaryY,
          overlayX: secondaryX,
          overlayY: secondaryY
        }
      ]);

    return strategy;
  }
}
