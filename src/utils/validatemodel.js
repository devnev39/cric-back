const auction = require("../models/auction");
const player = require("../models/player");
const team = require("../models/team");
const validatormessagewrapper = require("./validatormessagewrapper");
const modelValidator = require("./modelvalidator");
const jsonValidator = require("./jsonmodelvalidator");
const queryJsonSchema = require("../config/queryShema");

module.exports.auctionValidator = (auctionJson,neglect) => {
    return validatormessagewrapper(modelValidator,auctionJson,auction,neglect);
}

module.exports.teamValidator = (teamJson,neglect) => {
    return validatormessagewrapper(modelValidator,teamJson,team,neglect);
}

module.exports.playerValidator = (playerJson,neglect) => {
    return validatormessagewrapper(modelValidator,playerJson,player,neglect);
}

const checkObjectForKeys = (model,param) => {
    let result = "Parameter not found !";
    for(let key of Object.keys(model.schema.obj)){
        if(key == param) result = true;
    }
    return result;
}

module.exports.queryValidator = (queryJson,queryModel,neglect) => {
    let result = validatormessagewrapper(jsonValidator,queryJson,queryJsonSchema,neglect);
    if(result != true) return result;
    if(queryJson.group) return result;
    result = checkObjectForKeys(queryModel,queryJson.param);
    return result;
}