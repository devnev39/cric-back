const jsonModelValidator = require('./jsonmodelvalidator');
module.exports = (modelJson, model, neglect) => {
  return jsonModelValidator(modelJson, model.schema.obj, neglect);
};
