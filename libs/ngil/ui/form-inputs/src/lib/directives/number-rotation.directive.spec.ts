import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgControl } from '@angular/forms';
import { NumberRotationDirective } from './number-rotation.directive';

describe('NumberRotationDirective', () => {
  let directive: NumberRotationDirective;
  const elementRef = {
    nativeElement: { value: '' },
  };
  const ngControl = { control: { setValue: jest.fn() } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: elementRef },
        { provide: NgControl, useValue: ngControl },
      ],
    });
    directive = TestBed.runInInjectionContext(() => new NumberRotationDirective());
  });

  it('creates', () => {
    expect(directive).toBeTruthy();
  });
});
