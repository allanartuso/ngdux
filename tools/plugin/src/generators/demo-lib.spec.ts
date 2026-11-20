import { Tree, readJson, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { demoLibGenerator } from './demo-lib';
import { DemoLibGeneratorSchema } from './schema';

describe('demo-lib generator', () => {
  let tree: Tree;
  const options: DemoLibGeneratorSchema = { name: 'test', scope: 'demo', type: 'feature', unitTestRunner: 'none' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await demoLibGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
    expect(readJson(tree, 'tsconfig.base.json').compilerOptions.paths['@demo/demo/feature/test']).toEqual([
      'libs/demo/feature/test/src/index.ts',
    ]);
  });

  it.each([false, true])('should use a custom import prefix with isCommon=%s', async isCommon => {
    await demoLibGenerator(tree, { ...options, importPrefix: '@my-org', isCommon });

    const commonPath = isCommon ? '/common' : '';
    const config = readProjectConfiguration(tree, 'test');
    expect(config.root).toBe(`libs/demo${commonPath}/feature/test`);
    const paths = readJson(tree, 'tsconfig.base.json').compilerOptions.paths;
    expect(paths[`@my-org/demo${commonPath}/feature/test`]).toEqual([
      `libs/demo${commonPath}/feature/test/src/index.ts`,
    ]);
    expect(paths[`@demo/demo${commonPath}/feature/test`]).toBeUndefined();
  });
});
