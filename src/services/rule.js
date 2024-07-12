// const _ = require('lodash');
// const auction = require('../models/auction');
const {trywrapper} = require('../utils');
const Rule = require('../models/rule');
const ERRCODE = 801;

module.exports = {
  /**
   * Retrieves the rules associated with a specific auction.
   *
   * @param {Object} req - The request object.
   * @param {string} req.params.auctionId - The ID of the auction.
   * @return {Promise<Object>} A promise that resolves to an object containing the status and data.
   * @return {boolean} status - The status of the operation.
   * @return {Array} data - The retrieved rules.
   * @throws {Error} If an error occurs during the retrieval process.
   */
  getRules: async (req) => {
    return await trywrapper(async () => {
      const rules = await Rule.find({auctionId: req.params.auctionId});
      return {status: true, data: rules};
    }, ERRCODE);
  },

  /**
   * Retrieves all rules.
   *
   * @param {Object} req - The request object.
   * @return {Promise<Object>} A promise that resolves to an object containing the status and data.
   */
  getAllRules: async (req) => {
    return await trywrapper(async () => {
      const rules = await Rule.find();
      return {status: true, data: rules};
    }, ERRCODE);
  },

  /**
   * Adds a new rule.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body.rule - The rule to be added.
   * @return {Promise<Object>} A promise that resolves to an object containing the status and data.
   * @throws {Error} If an error occurs during the addition process.
   */
  addRule: async (req) => {
    return await trywrapper(async () => {
      // Issue 14 - (devnev39/cric-front)
      const rule = new Rule(req.body.rule);
      await rule.save();
      return {status: true, data: rule};
    }, ERRCODE);
  },

  /**
   * Deletes a rule from the database.
   *
   * @param {Object} req - The request object.
   * @param {string} req.params.auctionId - The ID of the rule to delete.
   * @return {Promise<Object>} A promise that resolves to an object with a status property indicating the success of the deletion.
   * @throws {Error} If an error occurs during the deletion process.
   */
  deleteRule: async (req) => {
    return await trywrapper(async () => {
      // req.params.auctionId as rule._id
      const result = await Rule.deleteOne({_id: req.params.auctionId});
      console.log(result);
      return {status: true};
    }, ERRCODE);
  },
};
