import { ElementRef } from '@angular/core';
import { OverlayToggleDirective } from './overlay-toggle.directive';
import { NgilOverlayComponent } from './overlay.component';

describe('OverlayToggleDirective', () => {
  let directive: OverlayToggleDirective;
  let overlayComponentMock: Partial<NgilOverlayComponent>;
  const elementRef = {
    nativeElement: { value: '' }
  };

  beforeEach(() => {
    overlayComponentMock = { origin: undefined, open: jest.fn() };
    directive = new OverlayToggleDirective(elementRef as ElementRef<HTMLInputElement>);
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
