const { addRule, deleteRule } = require("../../services/rule");
const { resultwrapper } = require("../../utils");

module.exports = {
    addRule : async (req,res) => resultwrapper(addRule,req,res,req),
    deleteRule : async (req,res) => resultwrapper(deleteRule,req,res,req)
}