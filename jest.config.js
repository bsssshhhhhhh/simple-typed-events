/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['build'],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['locales'],
  coverageReporters: ['html', 'lcov', 'json', 'text']
};
