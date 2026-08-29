export interface DemoLibGeneratorSchema {
  name: string;
  publishable?: boolean;
  isCommon?: boolean;
  scope: string;
  type: 'feature' | 'data-access' | 'data-model' | 'util' | 'ui';
  unitTestRunner: 'jest' | 'none' | 'vitest-angular' | 'vitest-analog';
}
