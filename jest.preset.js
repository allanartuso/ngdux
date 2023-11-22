const nxPreset = require('@nx/jest/preset').default;

module.exports = { ...nxPreset, coveragePathIgnorePatterns: ['.fixture.ts', 'index-test.ts'] };
