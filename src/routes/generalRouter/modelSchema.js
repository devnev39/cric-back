const auction = require("../../models/auction");
const player = require("../../models/player")
const team = require("../../models/team")
const { error, resultwrapper } = require("../../utils")


const ERRORCODE = 600;

const modelDictionary = {
    'player' : player.schema.obj,
    'team' : team.schema.obj,
    'auction' : auction.schema.obj
}

module.exports = (req,res) => {
    if(Object.keys(modelDictionary).indexOf(req.params.model) == -1) error(res,ERRORCODE,"Requested model not found in dictionary !");
    res.json({status : 200, data : Object.keys(modelDictionary[req.params.model])});
}