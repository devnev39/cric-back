const Auction = require("../models/auction");
const Team = require("../models/team");
const utils = require("../utils/index");
const ERRORCODE = 420;
module.exports = {
    getTeam : async () => {
        return await utils.trywrapper(async () => {
            const result = await Team.find();
            return {status : 200, data : result};
        },ERRORCODE);
    },
    addTeam : async (req) => {
        return await utils.trywrapper(async () => {
            const a = await Auction.findById(req.params.auction_id);
            if(!req.body.team.No) req.body.team.No = a.Teams.length + 1;
            const t = new Team(req.body.team);
            a.Teams.push(t);
            a.save();
            return {status : 200};
        },ERRORCODE);
    },
    deleteTeam : async (req) => {
        return await utils.trywrapper(async ()=> {
            const a = await Auction.findById(req.params.auction_id);
            let ind = 0;
            for(let team of a.Teams) if(team._id == req.params.team_id) ind = a.Teams.indexOf(team);
            a.Teams.pull({_id : req.params.team_id});
            for(let team of a.Teams) if(team.No > ind+1) team.No -= 1
            await a.save();
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
            return {status : 200};
        },ERRORCODE);
    }
}