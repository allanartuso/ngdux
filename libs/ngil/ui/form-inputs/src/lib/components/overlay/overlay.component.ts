import {
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ngil-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NgilOverlayComponent implements OnDestroy {
  @ViewChild('contentWrapper') el?: ElementRef;
  @Input() overwriteConfig: Partial<OverlayConfig> = {};

  private readonly destroy$ = new Subject<void>();
  private readonly maxHeight = 500;
  private overlayRef?: OverlayRef;

  origin?: ElementRef<HTMLInputElement>;
  isOpened = false;

  constructor(private readonly overlay: Overlay) {}

  open(): void {
    this.overlayRef = this.overlay.create(this.getOverlayConfig());

    const portal = new DomPortal(this.el);
    this.overlayRef.attach(portal);

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.close();
      });

    this.isOpened = true;
  }

  private getOverlayConfig(): OverlayConfig {
    return {
      positionStrategy: this.getStrategy(),
      hasBackdrop: true,
      backdropClass: this.origin ? 'cdk-overlay-transparent-backdrop' : 'cdk-overlay-dark-backdrop',
      panelClass: ['ngil-overlay-panel'],
      maxHeight: this.maxHeight,
      minWidth: this.origin?.nativeElement.offsetWidth,
      ...this.overwriteConfig
    };
  }

  private getStrategy(): GlobalPositionStrategy | FlexibleConnectedPositionStrategy {
    if (!this.origin) {
      return this.overlay.position().global().centerHorizontally().centerVertically();
    }

    const primaryX = 'start';
    const secondaryX = primaryX === 'start' ? 'end' : 'start';
    const primaryY = 'top';
    const secondaryY = 'bottom';

    return this.overlay
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
  }

  close(): void {
    this.destroy$.next();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.isOpened = false;
  }

  toggle(): void {
    if (this.isOpened) {
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
