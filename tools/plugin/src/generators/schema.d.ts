export interface DemoLibGeneratorSchema {
  name: string;
  publishable?: boolean;
  isCommon?: boolean;
  scope: string;
  type: 'feature' | 'data-access' | 'data-model' | 'util' | 'ui';
}
