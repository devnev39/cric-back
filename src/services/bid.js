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
            console.log(req.body.bid.player);

            for(let team of a.Teams) {
                if(team._id == req.body.bid.team._id) {
                    const p = new player(req.body.bid.player);
                    team.Players.push(p);
                    team.Current -= req.body.bid.amt;
                }
            }
            
            await a.save();
            a = await auction.findById(req.params.auction_id);
            b = JSON.parse(JSON.stringify(a));
            for(let team of b.Teams){
                team.Players = team.Players.map(player => {
                    return _.filter(a[setDataset], dplayer => dplayer._id == player._id)[0];
                });
            }
            delete b.dPlayers;
            delete b.cPlayers;
            if(req.io) await req.io.emit(req.params.auction_id, b);
            return {status : 200, data : a};
        },ERRCODE);
    },

    revertBid : async (req) => {
        return await trywrapper(async () => {
            /*
             Remove the player from team
             Add the sold price amt to team again
            */
            const a = await auction.findById(req.params.auction_id);

            const setDataset = a.poolingMethod == "Composite" ? "dPlayers" : "cPlayers";
            let filter = {_id : mongoose.Types.ObjectId(req.params.auction_id)};
            const dataset = `${setDataset}._id`;
            filter[dataset] = mongoose.Types.ObjectId(req.body.player._id);

            obj = {}
            obj[`${setDataset}.$[].SoldPrice`] = 1
            obj[`${setDataset}.$[].SOLD`] = 1
            obj[`${setDataset}.$[].team_id`] = 1

            const update = {
                '$unset' : obj
            }
            console.log(update);
            console.log(filter);
            console.log(req.body.player);
            await auction.updateOne(filter, update);

            for(let team of a.Teams){
                if(team._id == req.body.player.team_id){
                    _.remove(team.Players,(obj) => obj._id == req.body.player._id)
                    team.Current += req.body.player.SoldPrice;
                }
            }
            await a.save();
            b = JSON.parse(JSON.stringify(a));
            b.Teams.forEach(team => {
                console.log(team);
                team.Players = team.Players.map(player => {
                    // console.log()
                    // console.log(_.filter(a[setDataset], dplayer => dplayer.__id == player.__id));
                    console.log(player);
                    return _.filter(a[setDataset], (dplayer) => dplayer._id == player._id)[0]
                });
            })
            delete b.dPlayers;
            delete b.cPlayers;
            if(req.io) await req.io.emit(req.params.auction_id, b);
            return {status : 200, data : a};
        },ERRCODE);
    }
}