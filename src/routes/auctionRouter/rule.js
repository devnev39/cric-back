const {addRule, deleteRule, getRules} = require('../../services/rule');
const {resultwrapper} = require('../../utils');

module.exports = {
  getRules: async (req, res) => resultwrapper(getRules, req, res, req),
  addRule: async (req, res) => resultwrapper(addRule, req, res, req),
  deleteRule: async (req, res) => resultwrapper(deleteRule, req, res, req),
};
