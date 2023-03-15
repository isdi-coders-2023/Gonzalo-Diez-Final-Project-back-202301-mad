/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'dist',
    'user.mongo.model.ts',
    'addictions.mongo.model.ts',
    'users.router.ts',
  ],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'app.ts',
    'users.router.ts',
    'entities',
    'user.mongo.model.ts',
    'addictions.mongo.model.ts',
  ],
};
