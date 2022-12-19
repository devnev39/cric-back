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
    addTeam : async (teamJson) => {
        return await utils.trywrapper(async () => {
            if(!teamJson.No) teamJson.No = Team.countDocuments() + 1;
            const t = new Team(teamJson);
            await t.save();
            return {status : 200};
        },ERRORCODE);
    },
    deleteTeam : async (teamJson) => {
        return await utils.trywrapper(async ()=> {
            await Team.deleteOne({No : teamJson.No});
            return {status : 200};
        },ERRORCODE);
    },
    updateTeam : async (teamJson) => {
        return await utils.trywrapper(async () => {
            await Team.findOneAndReplace({No : teamJson.No},teamJson);    
            return {status : 200};
        },ERRORCODE);
    }
}