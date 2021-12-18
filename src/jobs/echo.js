const debug = require('debug')('NFTWebGenerator:jobs:echo');

async function echo(ctx, msg) {
  debug(msg);
}

module.exports = echo;
