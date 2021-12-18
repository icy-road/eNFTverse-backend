const { Joi } = require('../validator');

module.exports = {
  /**
   * @param sortColumns
   * @param maxPageSize
   * @param extraSchema
   * @returns {Joi.ObjectSchema<any>}
   */
  pageValidationSchema: (
    { sortColumns = [], maxPageSize = 24 } = {},
    extraSchema = {},
  ) => {
    const defaultSchema = {
      pageNumber: Joi.number()
        .integer()
        .min(1)
        .optional(),
      pageSize: Joi.number()
        .integer()
        .min(1)
        .max(maxPageSize)
        .optional(),
      sortDir: Joi.string()
        .valid('asc', 'desc')
        .optional(),
      sortBy: Joi.string()
        .valid(...sortColumns)
        .optional(),
    };

    return Joi.object(defaultSchema).concat(Joi.object(extraSchema));
  },
};
