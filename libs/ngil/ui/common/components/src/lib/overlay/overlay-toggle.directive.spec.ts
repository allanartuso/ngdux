import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgilOverlayToggleDirective } from './overlay-toggle.directive';
import { NgilOverlayComponent } from './overlay.component';

describe('NgilOverlayToggleDirective', () => {
  let directive: NgilOverlayToggleDirective;
  let overlayComponentMock: Partial<NgilOverlayComponent>;
  const elementRef = {
    nativeElement: { value: '' },
  };

  beforeEach(() => {
    overlayComponentMock = { origin: undefined, open: jest.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: ElementRef, useValue: elementRef }] });
    directive = TestBed.runInInjectionContext(() => new NgilOverlayToggleDirective());
    directive.ngilOverlayToggle = overlayComponentMock as NgilOverlayComponent;
  });

  it('sets the overlay origin', () => {
    directive.ngOnInit();

    expect(overlayComponentMock.origin).toStrictEqual(elementRef);
  });

  it('unsets the overlay origin', () => {
    directive.ngOnInit();

    directive.isOverlayOrigin = false;

    expect(overlayComponentMock.origin).toBe(undefined);
  });

  it('opens the overlay on click', () => {
    const event = { stopPropagation: jest.fn() } as unknown as Event;

    directive.onClick(event);

    expect(overlayComponentMock.open).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
