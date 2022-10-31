// craco.config.js (in root)
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@store': path.resolve(__dirname, 'src/store'),
    },
  },
  jest: {
    moduleNameMapper: {
      '^@(.+)': '<rootDir>/src/$1',
    },
  },
};
