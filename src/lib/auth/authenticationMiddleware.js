const assert = require('assert');
const { API_KEY, API_SECRET } = require('../../../config').security;

function authenticationMiddleware(opts = { required: true }) {
  const required = opts.required !== false;

  return async function session(ctx, next) {

    const apiKey = ctx.request.headers?.api_key;
    const apiSecret = ctx.request.headers?.api_secret;

    const missingCredentials = !apiKey || !apiSecret;

    if (required && missingCredentials) {
      ctx.body = {
        error: {
          code: 'authenticationRequired',
          message: 'Missing authentication credentials.',
        },
      };
      ctx.status = 403;

      return;
    }

    const credentialsMatch = apiKey === API_KEY && apiSecret === API_SECRET;

    if (!credentialsMatch) {
      ctx.body = {
        error: {
          code: 'invalidCredentials',
          message: 'Your api key and secret are not valid!',
        },
      };
      ctx.status = 403;

      return;
    }

    await next();
  };
}

module.exports = authenticationMiddleware;
