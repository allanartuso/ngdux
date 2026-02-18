
import { Component, Input } from '@angular/core';

@Component({
    selector: 'ngil-tooltip',
    imports: [],
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss'
})
export class NgilTooltipComponent {
  @Input() text = '';
}
