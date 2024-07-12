const webInputModels = require('../../models/wimodels');
const utils = require('../../utils');
const ERRORCODE = 600;
const modelDictionary = {
  player: webInputModels.player,
  team: webInputModels.team,
  auction: webInputModels.auction,
  PlayerRuleModel: webInputModels.PlayerRuleModel,
  TeamRuleModel: webInputModels.TeamRuleModel,
  tempUser: webInputModels.tempUser,
  AuctionViewModelAdmin: webInputModels.AuctionViewModelAdmin,
};
/**
 * Retrieves a model from the modelDictionary based on the specified model name in the request parameters.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {void} Sends a JSON response with the status and data of the requested model.
 */
module.exports = (req, res) => {
  if (Object.keys(modelDictionary).indexOf(req.params.model) == -1) {
    utils.error(res, ERRORCODE, 'Requested model not found in dictionary !');
    return;
  }
  if (req.params.model == 'auction') {
    res.json({status: true, data: modelDictionary[req.params.model]});
    return;
  } else if (req.session.isAuctionAuthenticated) {
    res.json({status: true, data: modelDictionary[req.params.model]});
  } else if (req.session.isAdminAuthenticated) {
    res.json({status: true, data: modelDictionary[req.params.model]});
  } else {
    console.log(req.session);
    utils.error(
        res,
        ERRORCODE,
        'Cannot get required model without authentication !',
    );
  }
};
