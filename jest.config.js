module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    "<rootDir>/src/components/__tests__/**/*.test.{js,jsx}",
    "<rootDir>/src/contexts/**/*.test.{js,jsx}",
    "<rootDir>/src/__tests__/**/*.test.{js,jsx}"
  ]
}; 