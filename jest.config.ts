import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  rootDir: '.',
  silent: true,
  collectCoverageFrom: ['src/**/*.ts', 'scripts/**/*.ts', '!src/**/*.d.ts'],
  coverageReporters: ['html', ['text', { skipFull: true }]],
};

export default config;
