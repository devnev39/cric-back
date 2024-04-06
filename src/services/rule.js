// const _ = require('lodash');
// const auction = require('../models/auction');
const {trywrapper} = require('../utils');
const Rule = require('../models/rule');
const ERRCODE = 801;

module.exports = {
  getRules: async (req) => {
    return await trywrapper(async () => {
      const rules = await Rule.find({auctionId: req.params.auctionId});
      return {status: true, data: rules};
    }, ERRCODE);
  },

  getAllRules: async (req) => {
    return await trywrapper(async () => {
      const rules = await Rule.find();
      return {status: true, data: rules};
    }, ERRCODE);
  },

  addRule: async (req) => {
    return await trywrapper(async () => {
      // Issue 14 - (devnev39/cric-front)
      const rule = new Rule(req.body.rule);
      await rule.save();
      return {status: true, data: rule};
    }, ERRCODE);
  },

  deleteRule: async (req) => {
    return await trywrapper(async () => {
      // req.params.auctionId as rule._id
      const result = await Rule.deleteOne({_id: req.params.auctionId});
      console.log(result);
      return {status: true};
    }, ERRCODE);
  },
};
