/* eslint-disable no-param-reassign,no-underscore-dangle */
const { Schema } = require('mongoose');
const { escapeRegExp } = require('lodash');

class MongooseAdapterModel {
  // This is a workaround for a weird Mongoose behavior: Schema.obj gets nested twice (Schema.obj.obj) with particular
  // Models (eg. Audio) defined outside of `common` project. This breaks the Mongoose hooks we use for caching
  // invalidation
  static createSchema(schemaFields, opts = {}) {
    return new Schema(schemaFields, opts);
  }

  static async create(data) {
    const instance = new this({
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    });
    return (await instance.save()).toObject();
  }

  static async findPaginated(filter, pagination, sortOptions, opts = { readPreference: 'secondaryPreferred' }) {
    const processedFilter = this.getProcessedFilter(filter);
    return this.convertAdapterPageToAppPage(await this.paginate(processedFilter, {
      page: pagination.pageNumber || 1,
      limit: pagination.pageSize || 24,
      sort: sortOptions,
      read: {
        pref: opts.readPreference,
      },
    }));
  }

  static async findMany(filter, opts = { readPreference: 'secondaryPreferred', sort: {} }) {
    if (!opts.readPreference) {
      opts.readPreference = 'secondaryPreferred';
    }
    return this.find(filter, null, opts);
  }

  static async update(filter, data, options) {
    const updateData = {
      updatedAt: new Date(),
      ...data,
    };
    return this.findOneAndUpdate(filter, updateData, {
      ...options,
      new: true,
      useFindAndModify: false,
    });
  }

  static async updateOrCreate(filter, data, options = {}) {
    return this.update(filter, data, { upsert: true, ...options });
  }

  static async delete(filter) {
    return (await this.deleteOne(filter)).deletedCount;
  }

  static async createMulti(multiData, opts = {}) {
    return this.collection.insertMany(multiData, opts);
  }

  static async removeAll(filter) {
    return this.deleteMany(filter);
  }

  static convertAdapterPageToAppPage(adapterPage) {
    const pageInfo = {
      itemsAvailable: adapterPage.totalDocs,
      pageSize: adapterPage.limit,
      pageNumber: adapterPage.page,
      totalPages: adapterPage.totalPages,
      hasPrevPage: adapterPage.hasPrevPage,
      hasNextPage: adapterPage.hasNextPage,
      prevPageNumber: adapterPage.prevPage,
      nextPageNumber: adapterPage.nextPage,
    };
    return {
      pageInfo,
      items: adapterPage.docs,
    };
  }

  static makeFieldCaseInsensitive(field) {
    const escapeInput = escapeRegExp(field);
    return new RegExp(`^${escapeInput}$`, 'i');
  }

  static makeFieldCaseInsensitiveAndPartialMatch(field) {
    const escapeInput = escapeRegExp(field);
    return new RegExp(`^.*${escapeInput}.*$`, 'i');
  }
}

module.exports = MongooseAdapterModel;
