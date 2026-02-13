import { Injectable } from '@angular/core';
import { ListNotificationService } from '@ngdux/data-model-common';
import { Observable, of } from 'rxjs';

@Injectable()
export class NotificationServicePlaceholder<Error> implements ListNotificationService<Error> {
  onListErrors(errors: Error): void {
    console.error('ERROR', errors);
  }

  onListDelete(ids: string[]): void {
    console.log(`Resources ${ids.join(', ')} have been deleted.`);
  }

  openConfirmationDialog(data: { message: string; title: string }): Observable<boolean> {
    console.log(data.title, data.message);

    return of(true);
  }
}
