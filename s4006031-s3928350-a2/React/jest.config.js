module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(axios)/)', // Transform axios and other necessary modules
    ],
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Add this line to include setupTests.js
  };
  