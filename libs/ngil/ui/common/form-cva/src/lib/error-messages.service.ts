import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DEFAULT_ERROR_MESSAGES, NgilErrorMessageConfig } from './error-messages.model';

@Injectable({ providedIn: 'root' })
export class NgilErrorMessagesService {
  private errorMessages: Record<string, string> = DEFAULT_ERROR_MESSAGES;
  private config: NgilErrorMessageConfig = {
    useDefaultReplacer: true
  };
  private errorMessagesChangedSubject = new Subject<void>();
  errorMessagesChanged$ = this.errorMessagesChangedSubject.asObservable();

  addErrorMessages(errorMessages: Record<string, string>) {
    this.errorMessages = { ...this.errorMessages, ...errorMessages };
  }

  setErrorMessages(errorMessages: Record<string, string>) {
    this.errorMessages = errorMessages;
  }

  /**
   * @deprecated
   * use setConfig instead
   */
  setUserReplacer(config: Partial<NgilErrorMessageConfig>) {
    this.config = { ...this.config, ...config };
  }

  setConfig(config: Partial<NgilErrorMessageConfig>) {
    this.config = { ...this.config, ...config };
  }

  getErrorMessage(errorKey: string, interpolateParams: Record<string, string>): string {
    if (!this.errorMessages[errorKey]) {
      return `Missing error message to the error with key ${errorKey}`;
    }

    if (this.config.useDefaultReplacer || !this.config.replacer) {
      return this.errorMessages[errorKey].replace(
        /{{(\w+)}}/g,
        (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
          interpolateParams[placeholderWithoutDelimiters]
            ? interpolateParams[placeholderWithoutDelimiters]
            : placeholderWithDelimiters
      );
    }

    return this.config.replacer
      ? this.config.replacer(this.errorMessages[errorKey], interpolateParams)
      : this.errorMessages[errorKey];
  }
}
