const Player = require("../models/player");
const utils = require("../utils/index");
const ERRORCODE = 410;

module.exports = {
	getPlayers : async () => {
		return await utils.trywrapper(async () => {
			const players = await Player.find();
			return {status : 200,data : players};
		},ERRORCODE);
	},
    addPlayers : async (playerJson) => {
        // If undefined add all players in data folder file
        // else add the player in json
        return await utils.trywrapper(async () => {
			if(playerJson){
	            const p = new Player(playerJson);
	            await p.save();
	        }else{
	            const data = await utils.readJson();
	            for(let player in data.data){
	                const p = new Player(player);
	                await p.save();
	            }
	        }
			return {status : 200}
		},ERRORCODE)
    },
	deletePlayer : async (playerJson) => {
		return await utils.trywrapper(async () => {
			await Player.deleteOne({SRNO : playerJson.SRNO});
			return {status : 200}
		},ERRORCODE);
	},
	updatePlayer : async (playerJson) => {
		return await utils.trywrapper(async () => {
			await Player.findOneAndReplace({SRNO : playerJson.SRNO},playerJson);
			return {status : 200};
		},ERRORCODE);
	}
}