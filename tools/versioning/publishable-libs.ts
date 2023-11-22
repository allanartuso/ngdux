import { ProjectGraphProjectNode } from 'nx/src/config/project-graph';
import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph';

export interface PackageJson {
  default: { name: string; version: string; dependencies: Object; repository: Object; homepage: string };
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

  const projectJson: ProjectJson = await import(`'../../${projectJsonFile}`);
  let packageJson: PackageJson | undefined = undefined;

  try {
    packageJson = await import(`'../../${packageJsonFile}`);
  } catch (e) {}

  return {
    packageJsonFile,
    projectJson,
    packageJson,
    projectRoot: node.data.root
  };
}
