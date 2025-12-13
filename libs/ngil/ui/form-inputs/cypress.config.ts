import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';
import { defineConfig } from 'cypress';

const comp = nxComponentTestingPreset(__filename);

export default defineConfig({
  component: {
    ...comp,
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true
  },
  viewportHeight: 720,
  viewportWidth: 1280
});
