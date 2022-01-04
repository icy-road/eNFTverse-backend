/* eslint-disable global-require */

console.log('Node version: ', process.version);
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

if (process.env.PROCESS_NAME === 'jobs') {
  require('./src/runJob');
} else {
  require('./src/app');
}
