const _ = require("lodash");
const Auction = require("../models/auction");
const Team = require("../models/team");
const utils = require("../utils/index");
const auction = require("../models/auction");
const { default: mongoose } = require("mongoose");
const ERRORCODE = 420;
module.exports = {
    getTeam : async (req) => {
        return await utils.trywrapper(async () => {
            const id = req.params.teamId;
            const auction = await Auction.find({"Teams.Key" : id})
            let Team = null;
            for(let team of auction[0].Teams){
                if(team.Key == id){
                    Team = team;
                }
            }
            return {status : 200, data : Team};
        },ERRORCODE);
    },
    addTeam : async (req) => {
        return await utils.trywrapper(async () => {
            const a = await Auction.findById(req.params.auction_id);
            const setDataset = a.poolingMethod == "Composite" ? "dPlayers" : "cPlayers";
            if (!req.body.team.No) {
              req.body.team.No = a.Teams.length + 1;
            }
            req.body.team.Current = req.body.team.Budget;
            req.body.team.AuctionMaxBudget = a.MaxBudget;
            req.body.team.Key = crypto.randomBytes(3).toString("hex");
            const t = new Team(req.body.team);
            a.Teams.push(t);
            await a.save();
            b = JSON.parse(JSON.stringify(a));
            b.cPlayers = null;
            b.dPlayers = null;
            for(let team of b.Teams){
                team.Players = team.Players.map(player => {
                    return _.filter(a[setDataset], dplayer => dplayer._id == player._id)[0];
                });
            }
            if (req.io) {
              await req.io.emit(req.params.auction_id, b);
            }
            return {status : 200, data : a};
        },ERRORCODE);
    },
    deleteTeam : async (req) => {
        return await utils.trywrapper(async ()=> {
            const a = await Auction.findById(req.params.auction_id);
            const setDataset = a.poolingMethod == "Composite" ? "dPlayers" : "cPlayers";
            let ind = 0;
            for(let team of a.Teams) if (team._id == req.params.team_id) {
                                       ind = a.Teams.indexOf(team);
                                     }
            a.Teams.pull({_id : req.params.team_id});
            for(let team of a.Teams) if (team.No > ind+1) {
                                       team.No -= 1
                                     }
            await a.save();
            b = JSON.parse(JSON.stringify(a));
            b.cPlayers = null;
            b.dPlayers = null;
            for(let team of b.Teams){
                team.Players = team.Players.map(player => {
                    return _.filter(a[setDataset], dplayer => dplayer._id == player._id)[0];
                });
            }
            if (req.io) {
              await req.io.emit(req.params.auction_id, b);
            }
            return {status : 200};
        },ERRORCODE);
    },
    updateTeam : async (req) => {
        return await utils.trywrapper(async () => {
            await Auction.findOneAndUpdate({_id : req.params.auction_id,'Teams._id' : req.params.team_id},
            {$set: {
                "Teams.$.Name": req.body.team.Name,
                "Teams.$.Budget": req.body.team.Budget,
             }}
            );
            // const a = await Auction.findById(req.params.auction_id);
            // for(let team of a.Teams){
            //     if(team._id == req.params.team_id){
                    
            //     }
            // }
            const a = await Auction.findById(req.params.auction_id);
            const setDataset = a.poolingMethod == "Composite" ? "dPlayers" : "cPlayers";
            b = JSON.parse(JSON.stringify(a));
            b.cPlayers = null;
            b.dPlayers = null;
            for(let team of b.Teams){
                team.Players = team.Players.map(player => {
                    return _.filter(a[setDataset], dplayer => dplayer._id == player._id)[0];
                });
            }
            if (req.io) {
              await req.io.emit(req.params.auction_id, b);
            }
            return {status : 200, data : a};
        },ERRORCODE);
    }
}