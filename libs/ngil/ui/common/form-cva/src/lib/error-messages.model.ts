export interface NgilErrorMessageConfig {
  /**
   * @deprecated
   * set replacer property to override the default replacer
   */
  useDefaultReplacer?: boolean;
  replacer?: (i18nKey: string, replacements: Record<string, string>) => string;
}

export const DEFAULT_ERROR_MESSAGES: Record<string, string> = {
  required: '{{fieldName}} is required.',
  max: 'Maximum {{fieldName}} is {{max}}.',
  min: 'Minimum {{fieldName}} is {{min}}.',
  maxlength: '{{fieldName}} can be max {{requiredLength}} characters long.',
  minlength: '{{fieldName}} must be at least {{requiredLength}} characters long.',
  email: '{{fieldName}} must be an email.'
};
