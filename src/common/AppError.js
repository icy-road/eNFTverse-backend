class AppError extends Error {
  constructor(message, statusCode, {
    extraData,
  } = {}) {
    const messageString = typeof message === 'string' ? message : JSON.stringify(message);
    super(messageString);

    this.statusCode = statusCode;
    this.extraData = extraData;
  }

  static assert(condition, message, statusCode = 400, opts = {}) {
    if (!condition) {
      throw new AppError(message, statusCode, opts);
    }
  }

  static throw(message, statusCode = 400, opts = {}) {
    throw new AppError(message, statusCode, opts);
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      extraData: this.extraData,
      message: this.message,
    };
  }
}

module.exports = AppError;
