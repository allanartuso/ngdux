import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'ngil-tooltip',
    imports: [CommonModule],
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss'
})
export class NgilTooltipComponent {
  @Input() text = '';
}
