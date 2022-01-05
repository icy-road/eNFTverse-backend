let Joi = require('joi');
const asyncBusboy = require('async-busboy');
const JoiStringArray = require('./joiStringArray');

Joi = Joi.extend(JoiStringArray);

const DEFAULT_SOFT_ERROR_STATUS_CODE = 422;
const DEFAULT_SOFT_ERROR_CODE = 'invalidInput';
const DEFAULT_OPTIONS = {
  // allows object to contain unknown keys which are ignored
  allowUnknown: false,
  // event is not supposed to have functions
  skipFunctions: false,
  // remove unknown elements from objects and arrays, if you need this behavior use .unknown()
  stripUnknown: true,
  // sets the default presence requirements: 'optional', 'required', or 'forbidden'
  presence: 'required',
  // when true, stops validation on the first error,
  // otherwise returns all the errors found. Defaults to true
  abortEarly: true,
};

function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function renderReadableJoiError(joiError) {
  const path = joiError.path.join('.');
  return {
    key: joiError.context.key,
    message: capitalize(`${joiError.message.replace(new RegExp(`"${path}"`, 'gi'), joiError.context.key)}.`),
    path,
  };
}

/**
 * Validation method
 * @param {Object} data
 * @param {Object} joiSchema
 * @param {Object} options
 * @returns {ok: false|true, [data: {errorField: errorMessage}]}
 */
function validate(data, joiSchema, options) {
  const { error, value } = Joi.object(joiSchema).validate(data, {
    ...options,
  });
  if (!error) {
    return { ok: true, value };
  }

  const errors = (error.details || []).map(renderReadableJoiError);

  return {
    ok: false,
    errors,
  };
}

validate.assert = function assertValidate(data, schema, options = DEFAULT_OPTIONS) {
  const joiSchema = schema.isJoi
    ? schema.options(options)
    : Joi.object()
      .options(options)
      .keys(schema);

  try {
    Joi.assert(data, joiSchema);
  } catch (err) {
    throw new Error(err.details[0].message);
  }
};

/**
 * Validation middleware
 * @param {Object} joiSchema
 * @param {Object} options
 * @returns {function(*, *)}
 */
function middleware(joiSchema, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  return async (ctx, next) => {

    const inputData = {
      query: { ...ctx.request.query },
      body: { ...ctx.request.body },
    };

    if(ctx.request.headers['content-type'].split(';')[0]==='multipart/form-data'){
      const {files, fields} = await asyncBusboy(ctx.req);
      inputData.formData = fields;
      files.forEach(file =>inputData.formData[file.fieldname]=file);
    }
    const validationResult = validate(inputData, joiSchema, opts);
    if (!validationResult.ok) {
      const message = validationResult.errors
        .map((error) => error.message)
        .join('\n');
      ctx.body = {
        error: {
          code: DEFAULT_SOFT_ERROR_CODE,
          data: validationResult.errors,
          message,
        },
      };
      ctx.status = DEFAULT_SOFT_ERROR_STATUS_CODE;

      return;
    }

    ctx.request.validQuery = validationResult.value.query;
    ctx.request.body = validationResult.value.body;
    ctx.request.formData = validationResult.value.formData;

    await next();
  };
}

module.exports = {
  Joi,
  validate,
  middleware,
};
