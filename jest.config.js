//@ts-check
/** @type {Partial<import("@jest/types").Config.InitialOptions>} */
const config = {
  preset: 'ts-jest',
  testRegex: ['/tests/.*tests?.[jt]sx?$', '/__tests__/.*tests?.[jt]sx?$', '.*.(spec|test).[jt]sx?$'],
  // I dono't think we need to run the spec multiple times.. the functional test on tests/ maybe.
  // We can change this if we consider it useful to run the spec tests when the code is transpiled to javascript
  testPathIgnorePatterns: ['node_modules', 'build/'],
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{js,ts,jsx,tsx}'],
  verbose: true,
  // Important to use the AfterEnv to have the jest timeout and all the other settings inside that file to be correctly understood
  // See the difference between setupFiles and setupFilesAfterEnv to see the difference.
  setupFilesAfterEnv: ['./jest.setup.js'],
};

module.exports = config;
