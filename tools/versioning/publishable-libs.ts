import { createProjectGraphAsync, ProjectGraphProjectNode, readJsonFile, workspaceRoot } from '@nx/devkit';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export interface PackageJson {
  name: string;
  version: string;
}

export interface ProjectJson {
  name: string;
  $schema: string;
  projectType: string;
  sourceRoot: string;
  prefix: string;
  targets: {
    build: {
      executor: string;
      outputs: string[];
      options: {
        project: string;
      };
      configurations: {
        production: {
          tsConfig: string;
        };
        development: {
          tsConfig: string;
        };
      };
      defaultConfiguration: string;
    };
  };
  tags: string[];
}

export interface ProjectInfo {
  packageJsonFile: string;
  projectRoot: string;
  projectJson: ProjectJson;
  packageJson?: PackageJson;
}

export async function getPublishableLibs(baseBranch: string) {
  const graph = await createProjectGraphAsync();
  // console.log(graph.nodes['ngil-ui-common-form-cva']);
  const promises: Promise<ProjectInfo>[] = [];

  for (const item of Object.values(graph.nodes)) {
    promises.push(getProjectInfo(item));
  }

  const projectFiles = await Promise.all(promises);
  return projectFiles.filter(file => !!file.packageJson);
}

async function getProjectInfo(node: ProjectGraphProjectNode): Promise<ProjectInfo> {
  const packageJsonFile = node.data.root + '/package.json';
  const projectJsonFile = node.data.root + '/project.json';

  const projectJson = readJsonFile<ProjectJson>(join(workspaceRoot, projectJsonFile));
  const packageJsonPath = join(workspaceRoot, packageJsonFile);
  const packageJson = existsSync(packageJsonPath) ? readJsonFile<PackageJson>(packageJsonPath) : undefined;

  return {
    packageJsonFile,
    projectJson,
    packageJson,
    projectRoot: node.data.root,
  };
}
