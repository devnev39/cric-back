// const {default: mongoose} = require('mongoose');
// const _ = require('lodash');
// const auction = require('../models/auction');
const {trywrapper} = require('../utils');
const auctionPlayers = require('../models/auctionPlayers');
const team = require('../models/team');
const DocumentNotFoundError = require('../errors/documentNotFound');
const TeamBudgetExhausted = require('../errors/teamBudgetExhausted');
const ERRCODE = 701;

// const getSoldPlayerQuery = (setDataset, auctionId, bid, reset = false) => {
//   const filter = {_id: mongoose.Types.ObjectId(auctionId)};
//   const dataset = `${setDataset}._id`;
//   filter[dataset] = mongoose.Types.ObjectId(bid.player._id);

//   const soldPriceParameter = `${setDataset}.$.soldPrice`;
//   const soldParameter = `${setDataset}.$.sold`;
//   const teamParam = `${setDataset}.$.team_id`;
//   const update = {};
//   update[soldPriceParameter] = reset ? 1 : bid.amt;
//   update[soldParameter] = reset ? 1 : bid.team.name;
//   update[teamParam] = reset ? 1 : bid.team._id;
//   return {update, filter};
// };

module.exports = {
  placeBid: async (req) => {
    return await trywrapper(async () => {
      // req.body.player
      // req.body.team
      // req.body.soldPrice
      let auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new DocumentNotFoundError();

      // Find the player in set dataset
      // If not found find in addedPlayers dataset

      let player = auctionPlayersObject[
          auctionPlayersObject.usedDataset
      ].filter((p) => p._id == req.body.player._id);
      if (player.length) {
        player = player[0];
      } else {
        player = auctionPlayersObject['addedPlayers'].filter(
            (p) => p._id == req.body.player._id,
        );
        if (player.length) {
          player = player[0];
        } else throw new DocumentNotFoundError();
      }

      if (player.sold) {
        throw new Error(`Player already sold to ${player.teamName} !`);
      }

      // Find the required team in team collection

      const t = await team.findById(req.body.team._id);
      if (!t) throw new DocumentNotFoundError();

      // Check if player can be sold or not !

      if (t.currentBudget < req.body.soldPrice) {
        throw new TeamBudgetExhausted();
      }

      // Set the player sold parameters

      player.sold = true;
      player.team_id = t._id;
      player.teamName = t.name;
      player.soldPrice = req.body.soldPrice;

      // Add player to the team list

      t.players.push({_id: player._id});
      t.currentBudget -= req.body.soldPrice;

      // Save the team, auctionPlayersObject

      await t.save();
      await auctionPlayersObject.save();

      // TODO: Socket implementation

      return {status: true};
    }, ERRCODE);
  },

  revertBid: async (req) => {
    return await trywrapper(async () => {
      // req.body.player
      // req.body.team

      let auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new DocumentNotFoundError();

      // Find player

      let player = auctionPlayersObject[
          auctionPlayersObject.usedDataset
      ].filter((p) => p._id == req.body.player._id);
      if (player.length) {
        player = player[0];
      } else {
        player = auctionPlayersObject['addedPlayers'].filter(
            (p) => p._id == req.body.player._id,
        );
        if (player.length) {
          player = player[0];
        } else throw new DocumentNotFoundError();
      }

      // Find the team

      const t = await team.findById(req.body.team._id);
      if (!t) throw new DocumentNotFoundError();

      // Remove the player from the team

      t.players.pull({_id: req.body.player._id});
      t.currentBudget += player.soldPrice;
      player.sold = false;
      player.soldPrice = 0;
      player.team_id = undefined;
      player.teamName = undefined;

      // save player
      // save auctionPlayersObject

      await t.save();
      await auctionPlayersObject.save();

      return {status: true};
    }, ERRCODE);
  },
};
