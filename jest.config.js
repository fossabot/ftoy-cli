module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/?(*.)spec.ts?(x)"
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/lib/",
    "/test/",
    "/node_modules/"
  ],
  testPathIgnorePatterns: [
    "/lib/",
    "/test/",
    "/node_modules/"
  ],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};