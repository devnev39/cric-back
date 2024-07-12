// const {default: mongoose} = require('mongoose');
// const _ = require('lodash');
// const Auction = require('../models/auction');
const {trywrapper} = require('../utils');
const auctionPlayers = require('../models/auctionPlayers');
const team = require('../models/team');
const mqtt = require('mqtt');
const DocumentNotFoundError = require('../errors/documentNotFound');
const TeamBudgetExhausted = require('../errors/teamBudgetExhausted');
const Auction = require('../models/auction');
const ERRCODE = 701;

module.exports = {
  /**
   * Place a bid for a player in an auction.
   *
   * @param {Object} req - The request object containing player, team, and soldPrice information.
   * @return {Object} Object containing the status of the bid and the player and team data.
   */
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
      let player = null;
      if (auctionPlayersObject.useCustom) {
        player = auctionPlayersObject.customPlayers.filter(
            (p) => p._id == req.body.player._id,
        );
      } else {
        player = auctionPlayersObject.players.filter(
            (p) => p._id == req.body.player._id,
        );
      }
      if (player.length) {
        player = player[0];
      } else throw new DocumentNotFoundError();

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

      const auction = await Auction.findById(req.params.auctionId);

      if (auction.allowRealtimeUpdates) {
        const client = mqtt.connect(process.env.MQTT_HOST, {
          username: process.env.MQTT_USERNAME,
          password: process.env.MQTT_PASSWORD,
        });
        client.on('connect', () => {
          client.publish(
              `/${req.params.auctionId}`,
              JSON.stringify({player, team: t}),
          );
        });
      }
      return {status: true, data: {player, team: t}};
    }, ERRCODE);
  },

  /**
   * Reverts a bid for a player in an auction.
   *
   * @param {Object} req - The request object containing auctionId and player information.
   * @return {Object} Object containing the status of the bid reversion and the player and team data.
   */
  revertBid: async (req) => {
    return await trywrapper(async () => {
      // req.body.player

      let auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new DocumentNotFoundError();

      // Find player

      let player = null;
      if (auctionPlayersObject.useCustom) {
        player = auctionPlayersObject.customPlayers.filter(
            (p) => p._id == req.body.player._id,
        );
      } else {
        player = auctionPlayersObject.players.filter(
            (p) => p._id == req.body.player._id,
        );
      }
      if (player.length) {
        player = player[0];
      } else throw new DocumentNotFoundError();

      // Find the team

      const t = await team.findById(req.body.player.team_id);
      if (!t && !req.body.resetHard) throw new DocumentNotFoundError();

      // Remove the player from the team
      if (t) {
        t.players.pull({_id: req.body.player._id});
        t.currentBudget += player.soldPrice;
      }
      player.sold = false;
      player.soldPrice = 0;
      player.team_id = undefined;
      player.teamName = undefined;

      // save player
      // save auctionPlayersObject
      if (t) await t.save();
      await auctionPlayersObject.save();

      const auction = await Auction.findById(req.params.auctionId);

      if (auction.allowRealtimeUpdates) {
        const client = mqtt.connect(process.env.MQTT_HOST, {
          username: process.env.MQTT_USERNAME,
          password: process.env.MQTT_PASSWORD,
        });
        client.on('connect', () => {
          client.publish(
              `/${req.params.auctionId}`,
              JSON.stringify({player, team: t}),
          );
        });
      }
      return {status: true, data: {player, team: t}};
    }, ERRCODE);
  },
};
