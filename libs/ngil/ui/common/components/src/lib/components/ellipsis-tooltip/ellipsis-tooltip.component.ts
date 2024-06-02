import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
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

  @Input() text = '';
  hasEllipsis = false;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const textContainer = this.textContainer?.nativeElement;
    if (textContainer) {
      this.hasEllipsis = textContainer.scrollWidth > textContainer.clientWidth;
    }
    this.cdr.markForCheck();
  }
}
