const {trywrapper} = require('../utils');
const ERRORCODE = 430;
module.exports = queryRunner = async (model, queries) => {
  return await trywrapper(async () => {
    // queries = [{query: [], accessor: ""}]
    const out = {};
    for (const q of queries) {
      const result = await model.aggregate(q.query);
      out[q.accessor] = result;
    }
    return {status: true, data: out};
  }, ERRORCODE);
};
