import { libraryGenerator } from '@nx/angular/generators';
import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { DemoLibGeneratorSchema } from './schema';
import path = require('path');

export async function demoLibGenerator(tree: Tree, options: DemoLibGeneratorSchema) {
  const angularLibOptions = {
    name: options.name,
    directory: getDirectory(options),
    publishable: options.publishable,
    importPath: getImportPath(options),
    changeDetection: 'OnPush' as const,
    style: 'scss' as const
  };

  await libraryGenerator(tree, angularLibOptions);
  await createIndexFile(tree, angularLibOptions.directory, options);
}

export default demoLibGenerator;

function getDirectory(options: DemoLibGeneratorSchema): string {
  let libPath = `libs/${options.scope}`;
  if (options.isCommon) {
    libPath = `${libPath}/common`;
  }
  libPath = `${libPath}/${options.type}/${options.name}`;

  return libPath;
}

function getImportPath(options: DemoLibGeneratorSchema): string {
  let importPath = `@demo/${options.scope}`;
  if (options.isCommon) {
    importPath = `${importPath}/common`;
  }
  importPath = `${importPath}/${options.type}/${options.name}`;

  return importPath;
}

async function createIndexFile(tree: Tree, projectRoot: string, options: DemoLibGeneratorSchema) {
  const rootOffset = projectRoot
    .split('/')
    .map(() => '..')
    .join('/');
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    template: '',
    rootOffset
  });
  await formatFiles(tree);
}
