import { ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

export interface FieldError {
  errors: ValidationErrors;
  fieldName: string;
  fieldIndex?: number;
}

export interface FieldErrors {
  [key: string]: FieldError[] | FieldErrors;
}

export interface FormService<DTO, CREATE_DTO = DTO> {
  loadResource(id: string): Observable<DTO>;

  saveResource?(resource: DTO): Observable<DTO>;

  deleteResource?(id: string): Observable<DTO>;

  createResource?(resource: CREATE_DTO): Observable<DTO>;
}

export interface FormNotificationService<ERROR> {
  onFormErrors: (errors: ERROR) => void;

  onFormDelete: (id: string) => void;
}
