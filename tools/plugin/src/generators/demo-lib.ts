import { libraryGenerator, UnitTestRunner } from '@nx/angular/generators';
import { names, Tree } from '@nx/devkit';
import { DemoLibGeneratorSchema } from './schema';

export async function demoLibGenerator(tree: Tree, options: DemoLibGeneratorSchema) {
  const buildable = options.unitTestRunner === 'vitest-angular' && !options.publishable;
  return libraryGenerator(tree, {
    name: options.name,
    directory: getDirectory(options),
    publishable: options.publishable,
    buildable,
    importPath: getImportPath(options, buildable || !!options.publishable),
    changeDetection: 'OnPush' as const,
    style: 'scss' as const,
    unitTestRunner: options.unitTestRunner as UnitTestRunner,
  });
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

function getImportPath(options: DemoLibGeneratorSchema, usePackageName: boolean): string {
  const prefix = options.importPrefix ?? '@demo';
  const segments = [options.scope];
  if (options.isCommon) {
    segments.push('common');
  }
  segments.push(options.type, options.name);
  if (!usePackageName) {
    return [prefix, ...segments].join('/');
  }
  const name = names(segments.join('-').replaceAll('/', '-')).fileName;
  const packageName = prefix.startsWith('@') ? `${prefix}/${name}` : names(`${prefix}-${name}`).fileName;
  if (packageName.length > 214 || !/^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(packageName)) {
    throw new Error(`Invalid npm package name "${packageName}". Check the import prefix, scope and library name.`);
  }
  return packageName;
}
