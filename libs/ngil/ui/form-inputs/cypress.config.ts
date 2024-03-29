import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';
import { defineConfig } from 'cypress';

const comp = nxComponentTestingPreset(__filename);

export default defineConfig({
  component: {
    ...comp
  },
  viewportHeight: 720,
  viewportWidth: 1280
});
