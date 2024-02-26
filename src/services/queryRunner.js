const {trywrapper} = require('../utils');
const ERRORCODE = 430;
module.exports = queryRunner = async (model, queryObj) => {
  return await trywrapper(async () => {
    const result = await model.aggregate(queryObj);
    return {status: true, data: result};
  }, ERRORCODE);
};
