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
            const a = await auction.findById(req.params.auction_id);
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
            
            for(let team of a.Teams) {
                if(team._id == req.body.bid.team._id) {
                    team.Players.push(new player(req.body.bid.player));
                    team.Current -= req.body.bid.amt;
                }
            }
            
            await a.save();

            return {status : 200};
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
            await auction.updateOne(filter, update);

            for(let team of a.Teams){
                if(team._id == req.body.player.team_id){
                    _.remove(team.Players,(obj) => obj._id == req.body.player._id)
                    team.Current += req.body.player.SoldPrice;
                }
            }
            await a.save();
            return {status : 200};
        },ERRCODE);
    }
}