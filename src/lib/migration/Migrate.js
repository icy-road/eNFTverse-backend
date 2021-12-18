const path = require('path');
const fs = require('fs');
const assert = require('assert');
const Umzug = require('umzug');
const MongoStorage = require('./MongoStorage');

async function Migrate(ctx, direction, dbType, dbConnection, serviceName) {
  assert(ctx.config, 'Config was not found.');
  assert(ctx.ROOT, 'ROOT path was not found.');
  assert(ctx.config.migrations, 'Migrations config was not found.');
  const { storage, migrationsPath } = ctx.config.migrations.umzug;
  const umzugMigrationsPath = path.join(ctx.ROOT, migrationsPath || 'src/migrations', dbType);
  assert(fs.existsSync(umzugMigrationsPath), 'Migrations path doesn\'t exist');
  const umzug = new Umzug({
    migrations: {
      path: umzugMigrationsPath,
      params: [ctx, dbConnection],
    },
    logging: ctx.debug,
    pattern: /^\d+[_][\w]+\.js$/,
    storage: storage === 'mongo' ? new MongoStorage({
      mongooseInstance: ctx.mongoose,
    }) : storage,
    storageOptions: {
      // Used only for umzung json local storage
      path: path.join(umzugMigrationsPath, `${process.env.NODE_ENV || 'dev'}_migrations.json`),
    },
  });

  await umzug[direction]();
  ctx.debug(`[${serviceName}->${dbType}] All migrations performed successfully`);
}
module.exports = Migrate;
