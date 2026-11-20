import { Tree, readJson, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { demoLibGenerator } from './demo-lib';
import { DemoLibGeneratorSchema } from './schema';

describe('demo-lib generator', () => {
  let tree: Tree;
  const options: DemoLibGeneratorSchema = { name: 'test', scope: 'demo', type: 'feature', unitTestRunner: 'none' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ formatter: 'none' });
    tree.write('.gitignore', '');
  });

  it('should run successfully', async () => {
    const task = await demoLibGenerator(tree, options);
    expect(typeof task).toBe('function');
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
    expect(readJson(tree, 'tsconfig.base.json').compilerOptions.paths['@demo/demo/feature/test']).toEqual([
      './libs/demo/feature/test/src/index.ts',
    ]);
    expect(tree.exists('libs/demo/feature/test/src/tsconfig.eslint.json')).toBe(false);
  });

  it('generates a scoped npm package name for a publishable library', async () => {
    await demoLibGenerator(tree, { ...options, importPrefix: '@my-org', isCommon: true, publishable: true });

    const project = readProjectConfiguration(tree, 'test');
    const pkg = readJson(tree, `${project.root}/package.json`);
    expect(pkg.name).toBe('@my-org/demo-common-feature-test');
    expect(pkg.private).not.toBe(true);
    expect(readJson(tree, 'tsconfig.base.json').compilerOptions.paths[pkg.name]).toEqual([
      `./${project.root}/src/index.ts`,
    ]);
  });

  it('generates a private buildable library when using the Angular Vitest runner', async () => {
    await demoLibGenerator(tree, { ...options, unitTestRunner: 'vitest-angular' });

    const project = readProjectConfiguration(tree, 'test');
    expect(tree.exists(`${project.root}/ng-package.json`)).toBe(true);
    expect(readJson(tree, `${project.root}/package.json`)).toMatchObject({
      name: '@demo/demo-feature-test',
      private: true,
    });
  });

  it.each([false, true])('should use a custom import prefix with isCommon=%s', async isCommon => {
    await demoLibGenerator(tree, { ...options, importPrefix: '@my-org', isCommon });

    const commonPath = isCommon ? '/common' : '';
    const config = readProjectConfiguration(tree, 'test');
    expect(config.root).toBe(`libs/demo${commonPath}/feature/test`);
    const paths = readJson(tree, 'tsconfig.base.json').compilerOptions.paths;
    expect(paths[`@my-org/demo${commonPath}/feature/test`]).toEqual([
      `./libs/demo${commonPath}/feature/test/src/index.ts`,
    ]);
    expect(paths[`@demo/demo${commonPath}/feature/test`]).toBeUndefined();
  });
});
