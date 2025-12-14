import { Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { demoLibGenerator } from './demo-lib';
import { DemoLibGeneratorSchema } from './schema';

describe('demo-lib generator', () => {
  let tree: Tree;
  const options: DemoLibGeneratorSchema = { name: 'test', scope: 'demo', type: 'feature' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await demoLibGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
