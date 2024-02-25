const auctionService = require('../../services/auction');
const utils = require('../../utils');
module.exports = {
  get: async (req, res) =>
    await utils.resultwrapper(auctionService.getAuction, req, res),
  post: async (req, res) =>
    await utils.resultwrapper(auctionService.addAuction, req, res, req.body),
};
