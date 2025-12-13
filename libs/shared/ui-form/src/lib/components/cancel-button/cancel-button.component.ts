import { Component, Input } from '@angular/core';

@Component({
    selector: 'demo-cancel-button',
    templateUrl: './cancel-button.component.html',
    styleUrls: ['./cancel-button.component.scss'],
    standalone: false
})
export class DemoCancelButtonComponent {
  @Input() disabled = false;
  @Input() text = 'Cancel';
}
