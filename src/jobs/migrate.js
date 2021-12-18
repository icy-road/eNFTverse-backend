const debug = require('debug')('NFTWebGenerator:jobs:migrate');
const assert = require('assert');
const Migrate = require('../lib/migration/Migrate');

async function migrate(ctx, direction = 'up', dbType = 'all') {
  debug('Started migrating...');

  ctx.debug = debug;

  const dbConnections = {
    mongo: ctx.mongoose,
  };
  assert(direction !== 'down' || dbType !== 'all', 'For migration "down" you need to specify a database');
  if (dbType === 'all') {
    for (const type of Object.keys(dbConnections)) {
      await Migrate(ctx, direction, type, dbConnections[type], 'site');
    }
  } else {
    await Migrate(ctx, direction, dbType, dbConnections[dbType], 'site');
  }

  debug('Finished migrating.');
}

module.exports = migrate;
