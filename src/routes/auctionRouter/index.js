const auction = require("../../models/auction");
const player = require("../../models/player");
const team = require("../../models/team");
const queryRunner = require("../../services/queryRunner");
const utils = require("../../utils");
const { resultwrapper } = require("../../utils");

const ERRORCODE = 440;

module.exports = {
    getAuction : async (req,res) => await utils.resultwrapper(async () => {
        return utils.trywrapper(async () => {
            const a = await auction.findById(req.params.auction_id);
            a.Password = undefined;
            return {status : 200,data : a};
        },ERRORCODE);
    },req,res)
}