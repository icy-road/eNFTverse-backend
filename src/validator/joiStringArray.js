module.exports = (joi) => ({
  base: joi.array(),
  type: 'stringArray',
  coerce: (value) => ({ value: value.replace(/^,+|,+$/mg, '').split(',') }),
});
