import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';
import { devServer } from '@cypress/webpack-dev-server';
import { defineConfig } from 'cypress';

const comp = nxComponentTestingPreset(__filename, { buildTarget: 'demo:build:development' });

export default defineConfig({
  component: {
    ...comp,
    // The workspace adapter supports Angular 22's webpack-dev-server 6; Cypress's bundled adapter does not.
    devServer: options => {
      const { projectConfig } = comp.devServer.options;
      const { buildOptions } = projectConfig;
      const { outputPath } = buildOptions;
      return devServer({
        ...comp.devServer,
        ...options,
        options: {
          projectConfig: {
            ...projectConfig,
            buildOptions: {
              ...buildOptions,
              outputPath: typeof outputPath === 'string' ? outputPath : outputPath.base,
            },
          },
        },
      });
    },
  },
  viewportHeight: 720,
  viewportWidth: 1280,
});
