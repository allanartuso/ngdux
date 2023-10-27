import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NgilOverlayComponent } from './overlay.component';

describe('NgilOverlayComponent', () => {
  let component: NgilOverlayComponent;
  let overlayMock: Partial<Overlay>;
  let overlayRefMock: Partial<OverlayRef>;
  let originMock: ElementRef;
  let backDropClickMock: Subject<void>;

  beforeEach(() => {
    backDropClickMock = new Subject();

    originMock = {
      nativeElement: {
        offsetWidth: 30,
        parentNode: {}
      }
    };

    overlayRefMock = {
      backdropClick: jest.fn().mockReturnValue(backDropClickMock),
      attach: jest.fn(),
      dispose: jest.fn()
    };

    overlayMock = {
      create: jest.fn().mockReturnValue(overlayRefMock),
      position: jest.fn().mockReturnValue({
        flexibleConnectedTo: jest.fn().mockReturnValue({
          withPositions: jest.fn()
        })
      })
    };

    TestBed.configureTestingModule({
      providers: [
        NgilOverlayComponent,
        {
          provide: Overlay,
          useValue: overlayMock
        }
      ]
    });

    component = TestBed.inject(NgilOverlayComponent);
    component.origin = originMock;
  });

  it('should open', () => {
    const maxHeight = 10;
    component.overwriteConfig = { maxHeight };

    component.open();

    expect(overlayMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        minWidth: originMock.nativeElement.offsetWidth,
        maxHeight
      })
    );
    expect(overlayRefMock.attach).toHaveBeenCalled();
    expect(overlayRefMock.backdropClick).toHaveBeenCalled();
    expect(component.isOpened).toEqual(true);
  });

  it('should close', () => {
    component.open();

    component.close();

    expect(overlayRefMock.dispose).toHaveBeenCalled();
    expect(component.isOpened).toEqual(false);
  });

  it('toggle should open if it is closed', () => {
    jest.spyOn(component, 'open');

    component.toggle();

    expect(component.open).toHaveBeenCalled();
  });

  it('toggle should close if it is opened', () => {
    jest.spyOn(component, 'close');
    component.isOpened = true;

    component.toggle();

    expect(component.close).toHaveBeenCalled();
  });

  it('should close on backdrop click', () => {
    jest.spyOn(component, 'close');
    component.open();

    backDropClickMock.next();

    expect(component.close).toHaveBeenCalled();
  });
});
