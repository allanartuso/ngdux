/* eslint-disable @angular-eslint/no-output-rename */
import { BooleanInput, coerceBooleanProperty, coerceStringArray } from '@angular/cdk/coercion';
import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ScrollStrategy
} from '@angular/cdk/overlay';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ComponentRef,
  Directive,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;

@Directive()
export abstract class MatDatepickerBase<D, P> implements OnDestroy, OnChanges {
  private _scrollStrategy: () => ScrollStrategy;
  private _inputStateChanges = Subscription.EMPTY;
  private _document = inject(DOCUMENT);

  /** An input indicating the type of the custom header component for the calendar, if set. */
  @Input() calendarHeaderComponent: ComponentType<any>;

  /** The date to open the calendar to initially. */
  @Input()
  get startAt(): D | null {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is.
    return this._startAt || null;
  }
  set startAt(value: D | null) {
    this._startAt = value;
  }
  private _startAt: D | null;

  /** The view that the calendar should start in. */
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';

  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a dropdown and elements have more padding to allow for bigger touch targets.
   */
  @Input()
  get touchUi(): boolean {
    return this._touchUi;
  }
  set touchUi(value: BooleanInput) {
    this._touchUi = coerceBooleanProperty(value);
  }
  private _touchUi = false;

  /** Whether the datepicker pop-up should be disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && !!this._disabled;
  }
  set disabled(value: BooleanInput) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this.stateChanges.next(undefined);
    }
  }
  private _disabled: boolean;

  /**
   * Whether to restore focus to the previously-focused element when the calendar is closed.
   * Note that automatic focus restoration is an accessibility feature and it is recommended that
   * you provide your own equivalent, if you decide to turn it off.
   */
  @Input()
  get restoreFocus(): boolean {
    return this._restoreFocus;
  }
  set restoreFocus(value: BooleanInput) {
    this._restoreFocus = coerceBooleanProperty(value);
  }
  private _restoreFocus = true;

  /**
   * Emits selected year in multiyear view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly yearSelected: EventEmitter<D> = new EventEmitter<D>();

  /**
   * Emits selected month in year view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly monthSelected: EventEmitter<D> = new EventEmitter<D>();

  /** Emits when the datepicker has been opened. */
  @Output('opened') readonly openedStream = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  @Output('closed') readonly closedStream = new EventEmitter<void>();

  /**
   * Classes to be passed to the date picker panel.
   * Supports string and string array values, similar to `ngClass`.
   */
  @Input()
  get panelClass(): string | string[] {
    return this._panelClass;
  }
  set panelClass(value: string | string[]) {
    this._panelClass = coerceStringArray(value);
  }
  private _panelClass: string[];

  /** Whether the calendar is open. */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: BooleanInput) {
    coerceBooleanProperty(value) ? this.open() : this.close();
  }
  private _opened = false;

  /** The id for the datepicker calendar. */
  id = `mat-datepicker-${datepickerUid++}`;

  /** A reference to the overlay into which we've rendered the calendar. */
  private _overlayRef: OverlayRef | null;

  /** Reference to the component instance rendered in the overlay. */
  private _componentRef: ComponentRef<P> | null;

  /** The element that was focused before the datepicker was opened. */
  private _focusedElementBeforeOpen: HTMLElement | null = null;

  /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
  private _backdropHarnessClass = `${this.id}-backdrop`;

  /** Emits when the datepicker's state changes. */
  readonly stateChanges = new Subject<void>();

  constructor(private _overlay: Overlay, private _ngZone: NgZone, private _viewContainerRef: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges) {
    const positionChange = changes['xPosition'] || changes['yPosition'];

    if (positionChange && !positionChange.firstChange && this._overlayRef) {
      const positionStrategy = this._overlayRef.getConfig().positionStrategy;

      if (positionStrategy instanceof FlexibleConnectedPositionStrategy) {
        this._setConnectedPositions(positionStrategy);

        if (this.opened) {
          this._overlayRef.updatePosition();
        }
      }
    }

    this.stateChanges.next(undefined);
  }

  ngOnDestroy() {
    this._destroyOverlay();
    this.close();
    this._inputStateChanges.unsubscribe();
    this.stateChanges.complete();
  }

  /** Emits the selected year in multiyear view */
  _selectYear(normalizedYear: D): void {
    this.yearSelected.emit(normalizedYear);
  }

  /** Emits selected month in year view */
  _selectMonth(normalizedMonth: D): void {
    this.monthSelected.emit(normalizedMonth);
  }

  /** Open the calendar. */
  open(): void {
    // Skip reopening if there's an in-progress animation to avoid overlapping
    // sequences which can cause "changed after checked" errors. See #25837.
    if (this._opened || this.disabled) {
      return;
    }

    this._focusedElementBeforeOpen = _getFocusedElementPierceShadowDom();
    this._openOverlay();
    this._opened = true;
    this.openedStream.emit();
  }

  /** Close the calendar. */
  close(): void {
    // Skip reopening if there's an in-progress animation to avoid overlapping
    // sequences which can cause "changed after checked" errors. See #25837.
    if (!this._opened) {
      return;
    }

    const canRestoreFocus =
      this._restoreFocus &&
      this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === 'function';

    const completeClose = () => {
      // The `_opened` could've been reset already if
      // we got two events in quick succession.
      if (this._opened) {
        this._opened = false;
        this.closedStream.emit();
      }
    };

    if (canRestoreFocus) {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  /** Forwards relevant values from the datepicker to the datepicker content inside the overlay. */
  protected _forwardContentValues(instance: P) {
    // instance.datepicker = this;
    // instance.color = this.color;
    // instance._dialogLabelId = this.datepickerInput.getOverlayLabelId();
    // instance._assignActions(this._actionsPortal, false);
  }

  /** Opens the overlay with the calendar. */
  private _openOverlay(): void {
    this._destroyOverlay();

    const isDialog = this.touchUi;
    // const portal = new ComponentPortal<MatDatepickerContent<S, D>>(MatDatepickerContent, this._viewContainerRef);
    const overlayRef = (this._overlayRef = this._overlay.create(
      new OverlayConfig({
        positionStrategy: this._getDialogStrategy(),
        hasBackdrop: true,
        backdropClass: [
          isDialog ? 'cdk-overlay-dark-backdrop' : 'mat-overlay-transparent-backdrop',
          this._backdropHarnessClass
        ],
        direction: 'ltr',
        scrollStrategy: isDialog ? this._overlay.scrollStrategies.block() : this._scrollStrategy(),
        panelClass: `mat-datepicker-${isDialog ? 'dialog' : 'popup'}`
      })
    ));

    this._getCloseStream(overlayRef).subscribe(event => {
      if (event) {
        event.preventDefault();
      }
      this.close();
    });

    // this._componentRef = overlayRef.attach(portal);
    this._forwardContentValues(this._componentRef.instance);

    // Update the position once the calendar has rendered. Only relevant in dropdown mode.
    if (!isDialog) {
      this._ngZone.onStable.pipe(take(1)).subscribe(() => overlayRef.updatePosition());
    }
  }

  /** Destroys the current overlay. */
  private _destroyOverlay() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = this._componentRef = null;
    }
  }

  /** Gets a position strategy that will open the calendar as a dropdown. */
  private _getDialogStrategy() {
    return this._overlay.position().global().centerHorizontally().centerVertically();
  }

  /** Sets the positions of the datepicker in dropdown mode based on the current configuration. */
  private _setConnectedPositions(strategy: FlexibleConnectedPositionStrategy) {
    const primaryX = 'start';
    const secondaryX = primaryX === 'start' ? 'end' : 'start';
    const primaryY = 'bottom';
    const secondaryY = 'top';

    return strategy.withPositions([
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

  /** Gets an observable that will emit when the overlay is supposed to be closed. */
  private _getCloseStream(overlayRef: OverlayRef) {
    return merge(
      overlayRef.backdropClick(),
      overlayRef.detachments(),
      overlayRef.keydownEvents().pipe(
        filter(event => {
          // Closing on alt + up is only valid when there's an input associated with the datepicker.
          return event.keyCode === 27;
        })
      )
    );
  }
}
