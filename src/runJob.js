const debug = require('debug')('NFTWebGenerator:jobs:runJob');
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const config = require('../config');
const newMongoose = require('../src/common/mongoose');
const models = require('./models');

const JOB_NAME = process.argv[2];
const JOB_OPTS = process.argv.slice(3);
const JOB_FILE_PATH = path.join(process.cwd(), `src/jobs/${JOB_NAME}.js`);

assert(fs.existsSync(JOB_FILE_PATH), `Unknown task "${JOB_NAME}"`);

// eslint-disable-next-line import/no-dynamic-require
const job = require(JOB_FILE_PATH);

const app = {
  ROOT: process.cwd(),
  models,
};
app.config = config;
app.debug = debug;
app.mongoose = newMongoose(config.mongo);

debug(`Running ${JOB_NAME}`);

job(app, ...JOB_OPTS)
  .then(() => {
    // Allow 3 sec delay window for logger
    debug(`Job "${JOB_NAME}" done. Quiting in 3 sec.`);
    setTimeout(() => {
      process.exit();
    }, 3000);
  })
  .catch((err) => {
    console.error(`Error running task ${JOB_NAME}: `, err);
    setTimeout(() => { process.exit(1); }, 1000);
  });
