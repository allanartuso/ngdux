import { Observable } from 'rxjs';
import { ErrorDto } from './error.dto';
import { RequestOptions } from './request-options.model';

export interface BulkOperationSuccess {
  index: number;
  response: unknown;
}

export interface ListService<T, S = T> {
  loadResources(options: RequestOptions): Observable<S[]>;

  deleteResources?(resourceIds: string[]): Observable<Array<T | ErrorDto>>;

  patchResources?(resourceIds: string[], resource: Partial<T>): Observable<Array<T | ErrorDto>>;
}

export interface ListNotificationService<E> {
  /**
   * @deprecated
   * This method will be removed from this interface and the abstract effects will not call it anymore
   */
  openConfirmationDialog?: (data: { message: string; title: string }) => Observable<boolean>;
  onListErrors: (errors: E) => void;
  onListDelete: (ids: string[]) => void;
}
