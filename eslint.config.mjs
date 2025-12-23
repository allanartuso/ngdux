import angular from '@angular-eslint/eslint-plugin';
import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/node_modules', '**/test-setup.ts', '**/jest.config.ts']
  },
  {
    plugins: {
      '@angular-eslint': angular
    },
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:publishable',
              onlyDependOnLibsWithTags: ['scope:publishable-common']
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared-common', 'scope:publishable', 'scope:publishable-common']
            },
            {
              sourceTag: 'scope:demo',
              onlyDependOnLibsWithTags: [
                'scope:shared-common',
                'scope:shared',
                'scope:demo',
                'scope:publishable',
                'scope:publishable-common'
              ]
            },
            {
              sourceTag: 'type:data-model',
              onlyDependOnLibsWithTags: ['type:data-model']
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util', 'type:data-model']
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:data-model', 'type:util', 'type:ui']
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:data-model', 'type:util']
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:feature', 'type:data-access', 'type:data-model', 'type:util', 'type:ui']
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:feature', 'type:data-access', 'type:data-model', 'type:util', 'type:ui']
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:data-model', 'type:util', 'type:ui']
            }
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-standalone': 'off'
    }
  }
];
