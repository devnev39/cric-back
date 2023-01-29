// Team filter will check for team and auction object
// Also team budget
const auction = require("../models/auction");
const Team = require("../models/team");
const ERRORCODE = 305;
const error = require("../utils/error");
const { teamValidator } = require("../utils/validatemodel");
const teamFilter = async (req,res,next) => {
    // if(!req.body.team && !req.body.auction) {error(res,ERRORCODE,"Team or auction object not found !");return;}
    // if((valid = teamValidator(req.body.team,["Players","No","Score"]))!=true) {error(res,ERRORCODE,valid);return;}
    const a = await auction.findById(req.params.auction_id);
    if(req.body.team.Budget > a.MaxBudget) {error(res,ERRORCODE,"Cannot set team budget more than set by auction !");return;}
    // if(result.length) {error(res,ERRORCODE,"Team with given No. already exists !");return;}
    next();
}

module.exports = teamFilter;