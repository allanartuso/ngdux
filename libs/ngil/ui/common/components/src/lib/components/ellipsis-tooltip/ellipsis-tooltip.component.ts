import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild
} from '@angular/core';
import { NgilTooltipDirective } from '../tooltip/tooltip.directive';

@Component({
  selector: 'ngil-ellipsis-tooltip',
  standalone: true,
  imports: [CommonModule, NgilTooltipDirective],
  templateUrl: './ellipsis-tooltip.component.html',
  styleUrl: './ellipsis-tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EllipsisTooltipComponent implements AfterViewInit {
  @ViewChild('textContainer') textContainer?: ElementRef<HTMLDivElement>;

  @Input() set text(text: string) {
    this._text = text;
    this.setHasEllipsis();
  }
  get text() {
    return this._text;
  }
  private _text = '';
  hasEllipsis = false;

  @HostListener('window:resize')
  private setHasEllipsis() {
    const textContainer = this.textContainer?.nativeElement;
    if (textContainer) {
      this.hasEllipsis = textContainer.scrollWidth > textContainer.clientWidth;
    }
  }

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.setHasEllipsis();
    this.cdr.detectChanges();
  }
}
