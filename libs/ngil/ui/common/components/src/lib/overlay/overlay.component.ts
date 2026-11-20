import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayModule,
  OverlayRef,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ngil-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [OverlayModule],
})
export class NgilOverlayComponent implements OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly overlay = inject(Overlay);

  @ViewChild('contentWrapper') el?: ElementRef;
  @Input() overwriteConfig: Partial<OverlayConfig> = {};
  @Input() positions: ConnectedPosition[] | undefined = undefined;

  private readonly destroy$ = new Subject<void>();
  private overlayRef?: OverlayRef;

  origin?: ElementRef<HTMLElement>;
  isOpened = false;

  open(): void {
    const config = this.getOverlayConfig();
    this.overlayRef = this.overlay.create(config);

    const portal = new DomPortal(this.el);
    this.overlayRef.attach(portal);

    if (config.hasBackdrop) {
      this.overlayRef
        .backdropClick()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.close();
        });
    }

    this.isOpened = true;
    this.cdr.markForCheck();
  }

  private getOverlayConfig(): OverlayConfig {
    return {
      positionStrategy: this.getStrategy(),
      hasBackdrop: true,
      backdropClass: this.origin ? 'cdk-overlay-transparent-backdrop' : 'cdk-overlay-dark-backdrop',
      panelClass: ['ngil-overlay-panel'],
      minWidth: this.origin?.nativeElement.offsetWidth,
      ...this.overwriteConfig,
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
      .withPositions(
        this.positions || [
          {
            originX: primaryX,
            originY: secondaryY,
            overlayX: primaryX,
            overlayY: primaryY,
          },
          {
            originX: primaryX,
            originY: primaryY,
            overlayX: primaryX,
            overlayY: secondaryY,
          },
          {
            originX: secondaryX,
            originY: secondaryY,
            overlayX: secondaryX,
            overlayY: primaryY,
          },
          {
            originX: secondaryX,
            originY: primaryY,
            overlayX: secondaryX,
            overlayY: secondaryY,
          },
        ],
      );
  }

  close(): void {
    this.destroy$.next();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.isOpened = false;
    this.cdr.markForCheck();
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
