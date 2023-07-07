const { placeBid, revertBid } = require("../../services/bid");
const { resultwrapper } = require("../../utils");

module.exports = {
    placeBid : async (req,res) => resultwrapper(placeBid,req,res,req),
    revertBid : async (req,res) => resultwrapper(revertBid,req,res,req)
}