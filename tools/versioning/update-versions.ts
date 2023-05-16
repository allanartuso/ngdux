import * as fs from 'fs';
import { ProjectGraphProjectNode } from 'nx/src/config/project-graph';
import { filterAffected } from 'nx/src/project-graph/affected/affected-project-graph';
import { calculateFileChanges } from 'nx/src/project-graph/file-utils';
import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph';
import { parseFiles } from 'nx/src/utils/command-line-utils';
import standardVersion from 'standard-version';

interface PackageJson {
  name: string;
  version: string;
  dependencies: Object;
  repository: Object;
  homepage: string;
}

interface ProjectJson {
  name: string;
  $schema: string;
  projectType: string;
  sourceRoot: string;
  prefix: string;
  targets: Object;
  tags: string[];
}

interface ProjectInfo {
  projectJsonFile: string;
  packageJsonFile: string;
  packageJson: PackageJson;
  projectJson: ProjectJson;
}

const BASE_BRANCH = process.env.npm_config_base || 'origin/master';

async function updatePublishableLibsVersions() {
  const graph = await createProjectGraphAsync();
  const files = parseFiles({ base: BASE_BRANCH }).files;
  const changes = calculateFileChanges(files, []);
  const affected = await filterAffected(graph, changes);

  await standardVersion({
    skip: {
      commit: true,
      tag: true
    }
  });

  const nextVersion = await getNextVersion();
  const publishableLibs = await getPublishableLibs(Object.values(affected.nodes));
  await updatePubLibsVersion(publishableLibs, nextVersion);

  // build

  await standardVersion({
    skip: {
      bump: true,
      changelog: true
    }
  });

  // publish

  process.exit(0);
}

async function getPublishableLibs(list: ProjectGraphProjectNode[]) {
  const promises: Promise<ProjectInfo>[] = [];

  for (const item of list) {
    promises.push(getProjectInfo(item));
  }

  const projectFiles = await Promise.all(promises);
  return projectFiles.filter(file => !!file.packageJson);
}

async function getProjectInfo(node: ProjectGraphProjectNode): Promise<ProjectInfo> {
  const packageJsonFile = node.data.root + '/package.json';
  const projectJsonFile = node.data.root + '/project.json';

  let packageJson;
  let projectJson;

  try {
    packageJson = await import(`'../../${packageJsonFile}`);
    projectJson = await import(`'../../${projectJsonFile}`);
  } catch (e) {}

  return {
    projectJsonFile,
    packageJsonFile,
    projectJson,
    packageJson
  };
}

async function getNextVersion(): Promise<string> {
  const packageJsonFile = '../../package.json';
  const packageJson = await import(packageJsonFile);

  return packageJson.version;
}

async function updatePubLibsVersion(publishableLibs: ProjectInfo[], nextVersion: string) {
  for (const lib of publishableLibs) {
    const newPackageJson = { ...lib.packageJson, version: nextVersion };

    await fs.promises.writeFile(lib.packageJsonFile, JSON.stringify(newPackageJson));
    console.log(`${lib.projectJson.name} version updated to ${nextVersion}`);
  }
}

updatePublishableLibsVersions();
