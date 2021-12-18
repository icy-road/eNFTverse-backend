/* eslint-disable func-names,no-param-reassign,no-underscore-dangle */
const debug = require('debug')('SXCommon:db:mongo');
const mongoose = require('mongoose');

function newMongoose(config) {
  if (config.debug) {
    mongoose.set('debug', config.debug);
  }

  mongoose.set('toObject', {
    versionKey: false,
    minimize: false,
    useProjection: true,
    transform(doc, ret) { delete ret._id; return ret; },
  });

  // enable lean option globally (https://mongoosejs.com/docs/tutorials/lean.html)
  const defOptions = { lean: true, projection: { _id: 0, __v: 0 } };
  const { setOptions } = mongoose.Query.prototype;
  mongoose.Query.prototype.setOptions = function (...args) {
    args[0] = args[0] ? { ...defOptions, ...args[0] } : defOptions;
    setOptions.apply(this, args);
    return this;
  };

  mongoose.Query.prototype.lean = function () {
    this._mongooseOptions.lean = true;
    return this;
  };

  const dbConnection = mongoose.createConnection(config.connectionUrl, config.mongoose);
  dbConnection.on('error', (err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
  dbConnection.once('open', () => config.debug && debug('mongo connection up'));

  return dbConnection;
}

module.exports = newMongoose;
