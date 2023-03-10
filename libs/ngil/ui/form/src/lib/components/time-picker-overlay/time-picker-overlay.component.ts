import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgilTimePickerComponent } from '../time-picker/time-picker.component';
import { TimePickerValue } from '../time-picker/time-picker.model';

@Component({
  selector: 'ngil-time-picker-overlay',
  template: ''
})
export class NgilTimePickerOverlayComponent implements OnDestroy {
  origin: ElementRef<HTMLInputElement>;
  valueChanges$ = new Subject<TimePickerValue>();
  isOpen = false;

  protected value: TimePickerValue | undefined;
  protected readonly destroy$ = new Subject<void>();
  protected contentComponent = NgilTimePickerComponent;
  protected componentInstance: undefined | NgilTimePickerComponent;
  private overlayRef: OverlayRef;

  constructor(private readonly overlay: Overlay) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.getStrategy(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });
    const portal = new ComponentPortal(this.contentComponent);
    const componentRef = this.overlayRef.attach(portal);
    this.componentInstance = componentRef.instance;
    this.componentInstance.writeValue(this.value);

    this.componentInstance.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const value = this.componentInstance.formGroup.getRawValue();
      this.valueChanges$.next(value);
    });

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

  private destroyOverlay() {
    this.destroy$.next();
    this.componentInstance?.ngOnDestroy();
    this.overlayRef?.dispose();
    this.componentInstance = undefined;
    this.overlayRef = undefined;
    this.isOpen = false;
  }

  setValue(inputText: string) {
    const split = inputText.split(':');

    this.value = {
      hour: +split[0],
      minute: +split[1] || 0,
      second: +split[2] || 0
    };

    if (this.componentInstance) {
      this.componentInstance.writeValue(this.value);
    }
  }

  private getStrategy() {
    const primaryX = 'start';
    const secondaryX = primaryX === 'start' ? 'end' : 'start';
    const primaryY = 'top';
    const secondaryY = 'bottom';

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
