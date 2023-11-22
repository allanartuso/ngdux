// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import { writeFileSync } from 'fs';
import { glob } from 'glob';
const root = './apps/demo-e2e/src';

async function createTestFiles() {
  const files = await glob(`${root}/integration/**/*.cy.ts`);

  let code = '';
  files.forEach(file => {
    code += `require('${file.replace(root, '..').replace(/\\/g, '\\\\')}');\n`;
  });

  writeFileSync(`${root}/integration-local/main.cy.ts`, code);
}

createTestFiles();
