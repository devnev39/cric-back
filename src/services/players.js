const auction = require("../models/auction");
const Player = require("../models/player");
const utils = require("../utils/index");
const { playerValidatorWimodel } = require("../utils/validatemodel");
const ERRORCODE = 410;

const getSrno = (a) => {
	let srno = 0;
	if (a.dPlayers.length) {
   srno = a.dPlayers[a.dPlayers.length-1].SRNO;
 }
	if (a.Add.length && a.Add[a.Add.length-1].SRNO > srno) {
       srno = a.Add[a.Add.length-1].SRNO
 }
	if (a.cPlayers.length && a.cPlayers[a.cPlayers.length-1].SRNO > srno) {
       srno = a.cPlayers[a.cPlayers.length-1].SRNO
 }
	return srno;
}

module.exports = {
	getPlayers : async (req) => {
		return await utils.trywrapper(async () => {
			const a = await auction.findById(req.params.auction_id);
			let resp = {};
			if(a.poolingMethod == "Composite") {
				resp.Main = a.dPlayers;
				resp.Add = a.Add;
				resp.Rmv = a.Rmv;
				resp.Sup = a.Sup;
			}else
			if(a.poolingMethod == "Custom") {
				resp.Main = a.cPlayers;
				resp.Add = a.Add;
				resp.Rmv = a.Rmv;
				resp.Sup = a.Sup;
			}
			return {status : 200, data : resp};
		},ERRORCODE);
	},
	uploadPlayers : async (req) => {
		return await utils.trywrapper(async () => {
			const a = await auction.findById(req.params.auction_id);
			let srno = getSrno(a);
			for(let p of req.body.players){
				p.SRNO = ++srno;
				if ((valid = playerValidatorWimodel(p,["IMGURL"]))!=true) {
      throw new Error(valid);
    }
				const player = new Player(p);
				if (a.poolingMethod == "Custom") {
      a.cPlayers.push(player);
    } else {
      throw new Error("Cannot upload players in Composite poolingMethod (Default players dataset) !");
    }
			}
			await a.save();
			return {status : 200};
		},ERRORCODE);
	}
	,
    addPlayers : async (req) => {
        return await utils.trywrapper(async () => {
			const a = await auction.findById(req.params.auction_id);
			let srno = getSrno(a);
			if(req.body.players){
				for(let p of req.body.players){
					p.SRNO = ++srno;
					const player = new Player(p);
					a.Add.push(player);
				}
			}else
			if(req.body.player){
				req.body.player.SRNO = ++srno;
				const player = new Player(req.body.player);
				a.Add.push(player);
			}else{
				throw new Error("player | players object not found !");
			}
			await a.save();
			return {status : 200};
		},ERRORCODE)
    },
	deletePlayer : async (req) => {
		return await utils.trywrapper(async () => {
			const a = await auction.findById(req.params.auction_id);
			if (!req.body.src && !req.body.dest) {
     a.Rmv.pull({_id : req.body.player._id});
   } else {
     throw new Error("DELETE method conditions not satisfied !");
   }
			await a.save();
			return {status : 200};
		},ERRORCODE);
	},
	updatePlayer : async (req) => {
		return await utils.trywrapper(async () => {
			req.body.player.Edited = true;
			const a = await auction.findById(req.params.auction_id);
			let player = null;
			let dataset = a.poolingMethod=="Composite" ? "dPlayers" : "cPlayers";
			for(let p of a.dPlayers) if (p._id == req.body.player._id) {
                              player = p;
                            }
			if (!player) {
     for(let p of a.Add) if(p._id == req.body.player._id) {player = p;dataset="Add"}
   };
			console.log(player,dataset);
			a[dataset].pull({_id : req.body.player._id});
			a[dataset].push(req.body.player);
			a[dataset].sort((a,b) => a.SRNO - b.SRNO);
			await a.save();
			const resp = await auction.findById(req.params.auction_id); 
			return {status : 200, data: resp};
		},ERRORCODE);
	},
	poolPlayers : async (req) => {
		return await utils.trywrapper(async () => {

		},ERRORCODE)
	},
	movePlayer : async (req) => {
		return await utils.trywrapper(async () => {
			const a = await auction.findById(req.params.auction_id);
			let player = null;
			let {src, dest} = req.body;
			if(req.body.src == "mPlayers" || req.body.dest == "mPlayers"){
				if (a.poolingMethod == "Composite" && req.body.src == "mPlayers") {
      src = "dPlayers"
    }
				if (a.poolingMethod == "Composite" && req.body.dest == "mPlayers") {
      dest = "dPlayers"
    }
				if (a.poolingMethod == "Custom" && req.body.src == "mPlayers") {
      src = "cPlayers"
    }
				if (a.poolingMethod == "Custom" && req.body.dest == "mPlayers") {
      dest = "cPlayers"
    }
			}
			for(let p of a[src]) if (p._id == req.body.player._id) {
                          player = p;
                        }
			a[src].pull({_id : req.body.player._id});
			a[dest].push(player);
			a[dest].sort((a,b) => a.SRNO - b.SRNO);
			await a.save();
			return {status : 200}
		},ERRORCODE)
	}
}