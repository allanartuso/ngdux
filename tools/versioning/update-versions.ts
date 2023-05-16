import { execSync } from 'node:child_process';
import { ProjectGraphProjectNode } from 'nx/src/config/project-graph';
import { filterAffected } from 'nx/src/project-graph/affected/affected-project-graph';
import { calculateFileChanges } from 'nx/src/project-graph/file-utils';
import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph';
import { parseFiles } from 'nx/src/utils/command-line-utils';

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
  packageJson: PackageJson;
  projectJson: ProjectJson;
}

const BASE_BRANCH = process.env.npm_config_base || 'origin/master';

async function updatePublishableLibsVersions() {
  const graph = await createProjectGraphAsync();
  const files = parseFiles({ base: BASE_BRANCH }).files;
  const changes = calculateFileChanges(files, []);
  const affected = await filterAffected(graph, changes);
  const publishableProjects = await getPublishableLibs(Object.values(affected.nodes));
  const latestVersion = getLatestVersion(publishableProjects);
  const cmd = `git log --pretty=%s master...v${latestVersion}`;

  const commitMessages = execSync(cmd).toString().split('\n');

  const structuralElements = commitMessages.map(commitMessage => commitMessage.split(':')[0]);
  console.log(structuralElements);

  const isMajor = structuralElements.some(el => el.includes('!') || el.includes('BREAKING CHANGE'));
  if (isMajor) {
    console.log('MAJOR');
    process.exit(0);
  }
  const isMinor = structuralElements.some(el => el.includes('feat'));
  if (isMinor) {
    console.log('MINOR');
    process.exit(0);
  }
  const isPatch = structuralElements.length;
  if (isPatch) {
    console.log('PATCH');
    process.exit(0);
  }

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

async function getProjectInfo(node: ProjectGraphProjectNode) {
  const projectJsonFile = '../../' + node.data.root + '/project.json';
  const packageJsonFile = '../../' + node.data.root + '/package.json';

  let projectJson;
  let packageJson;

  try {
    packageJson = await import(packageJsonFile);
    projectJson = await import(projectJsonFile);
  } catch (e) {}

  return {
    projectJson,
    packageJson
  };
}

function getLatestVersion(projects: ProjectInfo[]) {
  const versions = projects.map(p => p.packageJson.version).sort();
  const latestVersion = versions.pop();
  return latestVersion;
}

function getUpdateType() {}

updatePublishableLibsVersions();
