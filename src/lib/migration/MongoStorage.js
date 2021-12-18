const assert = require('assert');
const MigrationStorageMongooseAdapter = require('./MigrationStorageMongooseAdapter');

class MongoStorage {
  constructor(options) {
    const { mongooseInstance } = options;
    this.dbAdapter = MigrationStorageMongooseAdapter(mongooseInstance);
  }

  async logMigration(name) {
    try {
      return this.dbAdapter.create({
          migrationName: name,
        });
    } catch (e) {
      if (e.code === 'ConditionalCheckFailedException') {
        throw new Error('Duplicate migration');
      } else {
        throw e;
      }
    }
  }

  async unlogMigration(name) {
    return this.dbAdapter.delete({
      migrationName: name,
    });
  }

  async executed() {
    const results = await this.dbAdapter.findMany({});
    return results.map((el) => el.migrationName);
  }
}

module.exports = MongoStorage;
