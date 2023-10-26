import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { Component, ElementRef, HostBinding, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ngil-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class NgilOverlayComponent implements OnDestroy {
  @HostBinding('class.hidden') hidden = true;
  @ViewChild('contentWrapper') el?: ElementRef;
  @Input() maxHeight = 500;

  origin?: ElementRef<HTMLInputElement>;
  isOpen = false;

  protected readonly destroy$ = new Subject<void>();
  private overlayRef?: OverlayRef;

  constructor(private readonly overlay: Overlay) {}

  open() {
    const originWidth = this.origin?.nativeElement.offsetWidth;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.getStrategy(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      maxHeight: this.maxHeight,
      minWidth: originWidth
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

  private getStrategy() {
    const primaryX = 'start';
    const secondaryX = primaryX === 'start' ? 'end' : 'start';
    const primaryY = 'top';
    const secondaryY = 'bottom';

    if (!this.origin) {
      throw new Error('Origin is not defined');
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

  close(): void {
    this.destroy$.next();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.isOpen = false;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
