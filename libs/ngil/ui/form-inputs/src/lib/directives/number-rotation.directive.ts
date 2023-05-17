import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[ngilNumberRotation]'
})
export class NumberRotationDirective implements AfterViewInit, OnDestroy, OnInit {
  @Input() min = 0;
  @Input() max = 10;
  @Input() buttonUp?: HTMLElement;
  @Input() buttonDown?: HTMLElement;

  get length(): number {
    return this.max.toString().length;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown = (event: KeyboardEvent): void => {
    this.onKeyDownEvent(event);
  };

  @HostListener('input', ['$event'])
  onInput = (event: InputEvent): void => {
    let value = (event.target as HTMLInputElement).value;
    if (+value > this.max) {
      value = value.slice(this.length);
    }
    this.setValue(+value);
  };

  constructor(private readonly elementRef: ElementRef<HTMLInputElement>, private readonly ngControl: NgControl) {}

  ngOnInit(): void {
    this.elementRef.nativeElement.value = this.elementRef.nativeElement.value.toString().padStart(this.length, '0');
  }

  ngAfterViewInit(): void {
    this.buttonUp?.addEventListener('click', this.onUp);
    this.buttonDown?.addEventListener('click', this.onDown);
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
    this.setValue(value + 1);
  };

  private onDown = (): void => {
    const value = +this.elementRef.nativeElement.value;
    this.setValue(value - 1);
  };

  private setValue(value: number): void {
    if (value < this.min) {
      this.setInputValue(this.max);
    } else if (value > this.max) {
      this.setInputValue(this.min);
    } else {
      this.setInputValue(value);
    }
  }

  private setInputValue(value: number) {
    this.ngControl.control?.setValue(value);
    this.elementRef.nativeElement.value = value.toString().padStart(this.length, '0');
  }

  ngOnDestroy(): void {
    this.buttonUp?.removeEventListener('click', this.onUp);
    this.buttonDown?.removeEventListener('click', this.onDown);
  }
}
