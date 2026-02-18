import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgilTooltipDirective } from '../tooltip/tooltip.directive';

@Component({
  selector: 'ngil-ellipsis-tooltip',
  imports: [CommonModule, NgilTooltipDirective],
  templateUrl: './ellipsis-tooltip.component.html',
  styleUrl: './ellipsis-tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgilEllipsisTooltipComponent implements AfterViewInit, AfterContentChecked, OnDestroy {
  @ViewChild('textContainer') textContainer?: ElementRef<HTMLDivElement>;

  hasEllipsis = false;
  content = '';
  private debounceTimeOut = 0;

  @HostListener('window:resize')
  onResize() {
    this.setHasEllipsis();
  }

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.content = this.textContainer?.nativeElement.innerHTML || '';
    this.updateView();
  }

  ngAfterContentChecked(): void {
    const content = this.textContainer?.nativeElement.innerHTML || '';
    if (content !== this.content) {
      this.content = content;
      this.updateView();
    }
  }

  private updateView() {
    this.setHasEllipsis();
  }

  private setHasEllipsis() {
    clearTimeout(this.debounceTimeOut);

    this.debounceTimeOut = setTimeout(() => {
      const textContainer = this.textContainer?.nativeElement;
      if (textContainer) {
        const hasEllipsis = textContainer.scrollWidth > textContainer.clientWidth;

        if (this.hasEllipsis !== hasEllipsis) {
          this.hasEllipsis = hasEllipsis;
          this.cdr.detectChanges();
        }
      }
    }, 300);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimeOut);
  }
}
