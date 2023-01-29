const { addTeam, updateTeam, deleteTeam } = require("../../services/teams");
const { resultwrapper } = require("../../utils");

module.exports = {
    addTeam : async (req,res) => await resultwrapper(addTeam,req,res,req),
    updateTeam : async (req,res) => await resultwrapper(updateTeam,req,res,req),
    deleteTeam : async (req,res) => await resultwrapper(deleteTeam,req,res,req)
}