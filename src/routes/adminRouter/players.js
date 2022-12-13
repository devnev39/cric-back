const playerService = require("../../services/players");
const utils = require("../../utils/index")

const players = {
    get : async (req,res) => {
        await utils.resultwrapper(playerService.getPlayers,req,res);
    },
    post : async (req,res) => {
        await utils.resultwrapper(playerService.addPlayers,req,res,req.body.player);
    },
    delete : async (req,res) => {
        await utils.resultwrapper(playerService.deletePlayer,req,res,req.body.player);
    },
    put : async (req,res) => {
        await utils.resultwrapper(playerService.updatePlayer,req,res,req.body.player);
    }
}

module.exports = players;