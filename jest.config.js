
// const path = require('path');
// const envFile = path.join(__dirname, 'env.jest');


// require('dotenv').config({ path: envFile });


// module.exports = {
//   verbose: true,
//   testTimeout: 5000,

//   coverageThreshold: {
//     global: {
//       lines: 80,
//     },
//   },
// };


module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/unit/setup-env.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/index.js', '!src/server.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
