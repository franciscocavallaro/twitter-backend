/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ['./src/test/config.ts'],
  moduleNameMapper:{
    '^@utils': '<rootDir>/src/utils',
    '^@domains/(.*)': '<rootDir>/src/domains/$1',
    '^@s3-bucket': '<rootDir>/src/s3-bucket',
  }
}
