const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = require('mongoose');
const MongooseAdapterModel = require('../../common/MongooseAdapterModel');

const migrationSchemaFields = {
  migrationName: { type: String, required: true, unique: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
};

function MigrationMongooseAdapter(mongoose) {
  const migrationSchema = new Schema(migrationSchemaFields, { timestamps: true });
  class Migration extends MongooseAdapterModel {
  }

  migrationSchema.plugin(mongoosePaginate);
  migrationSchema.loadClass(Migration);

  return mongoose.model('Migration', migrationSchema, 'migration');
}

module.exports = MigrationMongooseAdapter;
