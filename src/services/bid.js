const { default: mongoose, mongo } = require("mongoose");
const _ = require("lodash");
const auction = require("../models/auction");
const player = require("../models/player");
const { trywrapper } = require("../utils");
const team = require("../models/team");
const ERRCODE = 701;

module.exports = {
    placeBid : async (req) => {
        return await trywrapper(async () => {
            let a = await auction.findById(req.params.auction_id);
            let update = {};
            
            const setDataset = a.poolingMethod == "Composite" ? "dPlayers" : "cPlayers";
            let filter = {_id : mongoose.Types.ObjectId(req.params.auction_id)};
            const dataset = `${setDataset}._id`;
            filter[dataset] = mongoose.Types.ObjectId(req.body.bid.player._id);

            const soldPriceParameter = `${setDataset}.$.SoldPrice`;
            const soldParameter = `${setDataset}.$.SOLD`;
            const teamParam = `${setDataset}.$.team_id`;

            update[soldPriceParameter] = req.body.bid.amt;
            update[soldParameter] = req.body.bid.team.Name;
            update[teamParam] = req.body.bid.team._id;

            await auction.updateOne(filter,{"$set" : update});
            
            req.body.bid.player.SOLD = req.body.bid.team.Name;
            req.body.bid.player.SoldPrice = req.body.bid.amt;
            req.body.bid.player.team_id = req.body.bid.team._id;
            let team_key = null;
            for(let team of a.Teams) {
                if(team._id == req.body.bid.team._id) {
                    const p = new player(req.body.bid.player);
                    team.Players.push(p);
                    team.Current -= req.body.bid.amt;
                    team_key = team.Key || null;
                }
            }
            a.Status = 'orange'; 
            
            await a.save();
            a = await auction.findById(req.params.auction_id);
            b = JSON.parse(JSON.stringify(a));
            for(let team of b.Teams){
                team.Players = team.Players.map(player => {
                    return _.filter(a[setDataset], dplayer => dplayer._id == player._id)[0];
                });
                if(team.Key == team_key){
                    req.io.emit(team.Key, team);
                }
            }
            if (req.io) {
              await req.io.emit(req.params.auction_id, b);
            }
            return {status : 200, data : a};
        },ERRCODE);
    },

    revertBid : async (req) => {
        return await trywrapper(async () => {
            /*
             Remove the player from team
             Add the sold price amt to team again
            */
            let a = await auction.findById(req.params.auction_id);

            const setDataset = a.poolingMethod == "Composite" ? "dPlayers" : "cPlayers";
            let filter = {_id : mongoose.Types.ObjectId(req.params.auction_id)};
            const dataset = `${setDataset}._id`;
            filter[dataset] = mongoose.Types.ObjectId(req.body.player._id);

            obj = {}
            obj[`${setDataset}.$.SoldPrice`] = 1
            obj[`${setDataset}.$.SOLD`] = 1
            obj[`${setDataset}.$.team_id`] = 1

            const update = {
                '$unset' : obj
            }
            await auction.updateOne(filter, update);

            filter = {
                "Teams._id" : mongoose.Types.ObjectId(req.body.player.team_id),
                "Teams.Players._id" : mongoose.Types.ObjectId(req.body.player._id)
            }
            await auction.updateOne(filter, {
                $pull : {
                    'Teams.$.Players': { _id: `${req.body.player._id}` }
                }
            })
            let b = await auction.findById(req.params.auction_id);
            let team_key = null;
            for(let team of b.Teams){
                if(team._id == req.body.player.team_id){
                    _.remove(team.Players,(obj) => obj._id == req.body.player._id)
                    team.Current += req.body.player.SoldPrice;
                    team_key = team.Key || null;
                }
            }
            await b.save();
            a = await auction.findById(req.params.auction_id);
            b = JSON.parse(JSON.stringify(b))
            b.Teams.forEach(team => {
                team.Players = team.Players.map(player => {
                    return _.filter(a[setDataset], dplayer => dplayer._id == player._id)[0]
                });
                if(team.Key == team_key){
                    req.io.emit(team.Key, team);
                }
            })
            b.password = undefined;
            a.password = undefined;
            if (req.io) {
              await req.io.emit(req.params.auction_id, b);
            }
            return {status : 200, data : a};
        },ERRCODE);
    }
}
