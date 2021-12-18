const { cloneDeepWith } = require('lodash');
const AppError = require('./AppError');

class Controller {
  constructor(debug) {
    this.debug = debug;

    AppError.assert(debug, 'Please pass the debug function from the subclass!', 500, { errorCode: 'internalServerError' });
  }

  hideSensitiveData(data, sensitiveKeys) {
    const customizer = (value, key) => {
      if (value && sensitiveKeys.includes(key)) {
        return '[hidden]';
      }
      return undefined;
    };
    return cloneDeepWith(data, customizer);
  }
}

module.exports = Controller;
