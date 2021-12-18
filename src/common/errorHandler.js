const AppError = require('./AppError');

function setResponseError(ctx, code, message, status, extraData) {
  ctx.body = {
    error: {
      code,
      message,
      extraData,
    },
  };
  ctx.status = status;
}

const errorHandler = (ctx, next) => next()
  .catch((err) => {
    if (err instanceof AppError) {
      return setResponseError(
        ctx, err?.errorCode || 'AppError', err.message, err.statusCode, err.extraData,
      );
    } else {
        return setResponseError(
            ctx, err?.errorCode || 'Error', err.message, 400,
        );
    }

    throw err;
  });

module.exports = errorHandler;
