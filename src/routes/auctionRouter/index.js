const auction = require("../../models/auction");
const { updateAuction, deleteAuction } = require("../../services/auction");
const utils = require("../../utils");
const teams = require("./teams");
const players = require("./players");
const bid = require("./bid");
const rule = require("./rule")

const ERRORCODE = 440;

module.exports = {
    getAuction : async (req,res) => await utils.resultwrapper(async () => {
        return utils.trywrapper(async () => {
            const a = await auction.findById(req.params.auction_id);
            a.Password = undefined;
            return {status : 200,data : a};
        },ERRORCODE);
    },req,res),
    updateAuction : async (req,res) => await utils.resultwrapper(updateAuction,req,res,req.body.auction),
    deleteAuction : async (req,res) => await utils.resultwrapper(deleteAuction,req,res,req.body.auction),
    teams : teams,
    players : players,
    bid : bid,
    rule : rule
}