import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';
import { defineConfig } from 'cypress';

const comp = nxComponentTestingPreset(__filename);

export default defineConfig({
  component: {
    ...comp,
    supportFile: 'support/component.ts',
    indexHtmlFile: 'support/component-index.html',
    specPattern: ['../src/**/*.cy.ts', '../src/**/*.cy.js']
  },
  viewportHeight: 720,
  viewportWidth: 1280
});
