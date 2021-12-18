// eslint-disable-next-line import/no-dynamic-require
module.exports = require(`./app.${process.env.NODE_ENV || 'prod'}.js`);
