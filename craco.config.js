// craco.config.js (in root)
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  jest: {
    moduleNameMapper: {
      '^@(.+)': '<rootDir>/src/$1',
    },
  },
};
