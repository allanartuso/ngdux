import { Observable } from 'rxjs';
import { ErrorDto } from './error.dto';
import { RequestOptions } from './request-options.model';

export interface BulkOperationSuccess {
  index: number;
  response: unknown;
}

export interface ListService<T, S = T, Params = Record<string, string>> {
  loadResources(options: RequestOptions<Params>): Observable<S[]>;

  deleteResources?(resourceIds: string[]): Observable<Array<T | ErrorDto | void>>;

  patchResources?(resourceIds: string[], resource: Partial<T>): Observable<Array<T | ErrorDto>>;
}

export interface ListNotificationService<E> {
  onListErrors: (errors: E) => void;
  onListDelete: (ids: string[]) => void;
}
