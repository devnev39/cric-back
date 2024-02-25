// const _ = require('lodash');
// const auction = require('../models/auction');
const {trywrapper} = require('../utils');
const Rule = require('../models/rule');
const ERRCODE = 801;

module.exports = {
  getRules: async (req) => {
    return await trywrapper(async () => {
      const rules = await Rule.find({auctionId: req.params.auctionId});
      return {status: 200, data: rules};
    }, ERRCODE);
  },
  addRule: async (req) => {
    return await trywrapper(async () => {
      // Issue 14 - (devnev39/cric-front)
      const rule = new Rule(req.body.rule);
      await rule.save();
      return {status: 200, data: rule};
    }, ERRCODE);
  },

  deleteRule: async (req) => {
    return await trywrapper(async () => {
      await Rule.deleteOne({_id: req.params.ruleId});
      return {status: 200};
    }, ERRCODE);
  },
};
