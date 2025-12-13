import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestState } from '@ngdux/data-model-common';

@Component({
    selector: 'demo-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
})
export class DemoFormComponent {
  @Input() isSubmitDisabled = false;
  @Input() isCancelDisabled = true;
  @Input() canEdit = true;
  @Input() formRequestState: RequestState | RequestState[] = RequestState.IDLE;

  @Output() submitted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onSubmit(): void {
    this.submitted.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
