const auctionService = require("../../services/auction");
const utils = require("../../utils/index");

module.exports = {
    delete : async (req,res) => await utils.resultwrapper(auctionService.deleteAuction,req,res,req.body.auction),
    put : async (req,res) => await utils.resultwrapper(auctionService.updateAuction,req,res,req.body.auction)
}