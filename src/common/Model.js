const {
  pick,
  isEmpty,
  pickBy,
  identity,
  camelCase,
} = require('lodash');
const { validate } = require('../validator');
const Page = require('./Page');
const AppError = require('./AppError');

class Model {
  constructor(dbAdapter, modelSchema) {
    this.dbAdapter = dbAdapter;
    if (modelSchema) {
      this.setSchema(modelSchema);
    }
  }

  async create(data) {
    const createData = {
      ...data,
    };
    this.validate(createData);

    return this.dbAdapter.create(createData);
  }

  setSchema(schema) {
    this.schema = schema;
    this.schemaFields = Object.keys(this.schema);
  }

  validate(data) {
    const valid = validate(data, this.schema, { abortEarly: false, stripUnknown: true });
    AppError.assert(valid.ok, valid.errors, 422);
  }

  async findOne(filter) {
    return this.dbAdapter.findOne(filter);
  }

  async findMany(filter, opts) {
    return (await this.dbAdapter.findMany(filter, opts)) || [];
  }

  async findOneRealTime(filter) {
    return this.dbAdapter.findOne(filter, null, { readPreference: 'primary' });
  }

  async findManyRealTime(filter) {
    return this.dbAdapter.findMany(filter, { readPreference: 'primary' });
  }

  async exists(filter) {
    return (await this.dbAdapter.countDocuments(filter)) > 0;
  }

  async count(filter, opts = { readPreference: 'secondaryPreferred' }) {
    return this.dbAdapter.countDocuments({ ...filter }).read(opts.readPreference);
  }

  async bulkWrite(operations, options) {
    return this.dbAdapter.bulkWrite(operations, options);
  }

  async updateMany(filter, data) {
    this.validate(data);
    return this.dbAdapter.updateMany(filter, data);
  }

  async getPaginated(filter, pagination, sortOptions) {
    return this.toAppPage(await this.dbAdapter.findPaginated(filter, pagination, sortOptions));
  }

  async delete(filter) {
    return this.dbAdapter.delete(filter);
  }

  toJSON(modelData, skipSchemaValidation = false) {
    if (!modelData) return null;
    if (skipSchemaValidation) {
      return modelData;
    }
    return pick(modelData, this.schemaFields);
  }

  toJSONArray(modelDataArray, skipSchemaValidation = false) {
    if (!modelDataArray) return null;
    if (skipSchemaValidation) {
      return modelDataArray;
    }
    return modelDataArray.map((modelData) => pick(modelData, this.schemaFields));
  }

  toAppPage({ pageInfo, items }, skipSchemaValidation = false) {
    return new Page(items.map((item) => this.toJSON(item, skipSchemaValidation)), pageInfo);
  }
}

module.exports = Model;
