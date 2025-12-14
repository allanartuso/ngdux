export interface DemoLibGeneratorSchema {
  name: string;
  publishable?: boolean;
  isCommon?: boolean;
  scope: 'shared' | 'demo' | 'ngdux' | 'ngil';
  type: 'feature' | 'data-access' | 'data-model' | 'util' | 'ui';
}
