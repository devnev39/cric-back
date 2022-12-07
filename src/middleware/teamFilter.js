// Team filter will check for team and auction object
// Also team budget
const Team = require("../models/team");
const ERRORCODE = 305;
const error = require("../utils/error");
const { teamValidator } = require("../utils/validatemodel");
const teamFilter = async (req,res,next) => {
    if(!req.body.team || !req.body.auction) {error(res,ERRORCODE,"Team or auction object not found !");return;}
    if((valid = teamValidator(req.body.team,["Players"]))!=true) {error(res,ERRORCODE,valid);return;}
    if(req.body.team.Budget > req.body.auction.MaxBudget) {error(res,ERRORCODE,"Cannot set team budget more than set by auction !");return;}
    const result = await Team.find({No : req.body.team.No});
    if(result.length) {error(res,ERRORCODE,"Team with given No. already exists !");return;}
    next();
}

module.exports = teamFilter;