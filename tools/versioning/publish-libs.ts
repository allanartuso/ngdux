import { execSync } from 'child_process';
import { getPublishableLibs } from './publishable-libs';

const BASE_BRANCH = process.env.npm_config_base || 'origin/master';

export async function publishLibs() {
  const publishableLibs = await getPublishableLibs(BASE_BRANCH);
  const publishableLibNames: string[] = publishableLibs.map(lib => lib.projectJson.name);
  const publishableLibDistFolder: string[] = publishableLibs
    .filter(lib => lib.projectJson.name !== 'workspace-plugin')
    .map(lib => lib.projectRoot);

  execSync(`nx run-many --target=build --projects=${publishableLibNames.join(',')}`, {
    stdio: 'inherit',
    timeout: 1000 * 60 * 15,
  });

  const publishCmd = publishableLibDistFolder
    .map(folder => `npm publish --access public dist/${folder.replace('{workspaceRoot}/', '')}`)
    .join(' && ');

  execSync(publishCmd, { stdio: 'inherit', timeout: 1000 * 60 * 5 });

  process.exit(0);
}

publishLibs();
