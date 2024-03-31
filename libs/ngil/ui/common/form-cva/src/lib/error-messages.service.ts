import { Injectable } from '@angular/core';
import { DEFAULT_ERROR_MESSAGES, NgilErrorMessageConfig } from './error-messages.model';

@Injectable({ providedIn: 'root' })
export class NgilErrorMessagesService {
  private errorMessages: Record<string, string> = DEFAULT_ERROR_MESSAGES;
  private config: NgilErrorMessageConfig = {
    useDefaultReplacer: true
  };

  addErrorMessages(errorMessages: Record<string, string>) {
    this.errorMessages = { ...this.errorMessages, ...errorMessages };
  }

  setErrorMessages(errorMessages: Record<string, string>) {
    this.errorMessages = errorMessages;
  }

  setUserReplacer(config: Partial<NgilErrorMessageConfig>) {
    this.config = { ...this.config, ...config };
  }

  getErrorMessage(errorKey: string, replacements: Record<string, string>): string {
    if (!this.errorMessages[errorKey]) {
      return `Missing error message to the error with key ${errorKey}`;
    }

    if (this.config.useDefaultReplacer) {
      return this.errorMessages[errorKey].replace(
        /{{(\w+)}}/g,
        (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
          replacements[placeholderWithoutDelimiters]
            ? replacements[placeholderWithoutDelimiters]
            : placeholderWithDelimiters
      );
    }

    return this.errorMessages[errorKey];
  }
}
