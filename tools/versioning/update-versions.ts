import { execSync } from 'child_process';
import * as fs from 'fs';
import standardVersion from 'standard-version';
import { ProjectInfo, getPublishableLibs } from './publishable-libs';

const BASE_BRANCH = process.env.npm_config_base || 'origin/master';

async function updatePublishableLibsVersions() {
  const publishableLibs = await getPublishableLibs(BASE_BRANCH);

  await standardVersion({
    skip: {
      commit: true,
      tag: true,
      changelog: true
    }
  });
  const nextVersion = await getNextVersion();

  await updatePubLibsVersion(publishableLibs, nextVersion);
  execSync('git add .', { stdio: 'inherit' });
  execSync(` git push origin v${nextVersion}`, { stdio: 'inherit' });

  await standardVersion({
    skip: {
      bump: true
    },
    commitAll: true
  });

  process.exit(0);
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
