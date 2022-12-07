const auction = require("../models/auction");
const player = require("../models/player");
const team = require("../models/team");
const validatormessagewrapper = require("./validatormessagewrapper");

const modelValidator = (modelJson,model,neglect) => {
    const keys = Object.keys(modelJson);
    let result = true;
    const neglects = neglect ? neglect : [];
    model.schema.eachPath(path => {
        if(path[0] != "_")
            if(keys.indexOf(path) == -1 && neglects.indexOf(path) == -1) result = path;
    });
    return result;
}

module.exports.auctionValidator = (auctionJson,neglect) => {
    return validatormessagewrapper(modelValidator,auctionJson,auction,neglect);
}

module.exports.teamValidator = (teamJson,neglect) => {
    return validatormessagewrapper(modelValidator,teamJson,team,neglect);
}

module.exports.playerValidator = (playerJson,neglect) => {
    return validatormessagewrapper(modelValidator,playerJson,player,neglect);
}