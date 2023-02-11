import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[ngilNumberRotation]'
})
export class NumberRotationDirective implements AfterViewInit, OnDestroy {
  @Input() min: number;
  @Input() max: number;
  @Input() buttonUp: HTMLElement;
  @Input() buttonDown: HTMLElement;

  get length(): number {
    return this.max.toString().length;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown = (event: KeyboardEvent): void => {
    this.onKeyDownEvent(event);
  };

  @HostListener('input', ['$event'])
  onInput = (event: InputEvent): void => {
    this.setControlValue(+(event.target as HTMLInputElement).value);
  };

  constructor(private readonly elementRef: ElementRef<HTMLInputElement>, private readonly ngControl: NgControl) {}

  ngAfterViewInit(): void {
    this.buttonUp.addEventListener('click', this.onUp);
    this.buttonDown.addEventListener('click', this.onDown);
  }

  private onKeyDownEvent(event: KeyboardEvent): void {
    if (!this.isKeyValid(event.key)) {
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.onUp();
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.onDown();
    }
  }

  private isKeyValid(key: string): boolean {
    if (key.length !== 1 || !isNaN(+key)) {
      return true;
    }

    return false;
  }

  private onUp = (): void => {
    const value = +this.elementRef.nativeElement.value;
    this.setControlValue(value + 1);
  };

  private onDown = (): void => {
    const value = +this.elementRef.nativeElement.value;
    this.setControlValue(value - 1);
  };

  private setControlValue(value: number): void {
    if (value < this.min) {
      this.ngControl.control.setValue(this.max);
    } else if (value > this.max) {
      this.ngControl.control.setValue(this.min);
    } else {
      this.ngControl.control.setValue(value);
    }
  }

  ngOnDestroy(): void {
    this.buttonUp.removeEventListener('click', this.onUp);
    this.buttonDown.removeEventListener('click', this.onDown);
  }
}
