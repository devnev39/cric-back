const auctionService = require('../../services/auction');
const utils = require('../../utils/index');

module.exports = {
  delete: async (req, res) =>
    await utils.resultwrapper(auctionService.deleteAuctionAdmin, req, res, req),
  put: async (req, res) =>
    await utils.resultwrapper(auctionService.updateAuctionAdmin, req, res, req),
  get: async (req, res) =>
    await utils.resultwrapper(auctionService.getAuctionAdmin, req, res),
};
