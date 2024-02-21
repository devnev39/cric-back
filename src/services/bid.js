const {default: mongoose} = require('mongoose');
const _ = require('lodash');
const auction = require('../models/auction');
const player = require('../models/player');
const {trywrapper} = require('../utils');
const ERRCODE = 701;

const getSoldPlayerQuery = (setDataset, auctionId, bid, reset = false) => {
  const filter = {_id: mongoose.Types.ObjectId(auctionId)};
  const dataset = `${setDataset}._id`;
  filter[dataset] = mongoose.Types.ObjectId(bid.player._id);

  const soldPriceParameter = `${setDataset}.$.soldPrice`;
  const soldParameter = `${setDataset}.$.sold`;
  const teamParam = `${setDataset}.$.team_id`;
  const update = {};
  update[soldPriceParameter] = reset ? 1 : bid.amt;
  update[soldParameter] = reset ? 1 : bid.team.name;
  update[teamParam] = reset ? 1 : bid.team._id;
  return {update, filter};
};

module.exports = {
  placeBid: async (req) => {
    return await trywrapper(async () => {
      let a = await auction.findById(req.params.auction_id);

      const setDataset =
        a.poolingMethod == 'Composite' ? 'dPlayers' : 'cPlayers';
      const {update, filter} = getSoldPlayerQuery(
          setDataset,
          req.params.auction_id,
          req.body.bid,
      );

      let result = await auction.updateOne(filter, {$set: update});
      console.log('BID query result : ', result);
      if (!result.modifiedCount && !result.matchedCount) {
        const {update, filter} = getSoldPlayerQuery(
            'add',
            req.params.auction_id,
            req.body.bid,
        );
        result = await auction.updateOne(filter, {$set: update});
        if (!result.modifiedCount && !result.matchedCount) {
          throw new Error('Player not found in any dataset !');
        }
      }
      req.body.bid.player.sold = req.body.bid.team.name;
      req.body.bid.player.soldPrice = req.body.bid.amt;
      req.body.bid.player.team_id = req.body.bid.team._id;
      let teamKey = null;
      for (const team of a.Teams) {
        if (team._id == req.body.bid.team._id) {
          const p = new player(req.body.bid.player);
          team.players.push(p);
          team.currentBudget -= req.body.bid.amt;
          teamKey = team.key || null;
        }
      }
      a.status = 'orange';

      await a.save();
      a = await auction.findById(req.params.auction_id);
      a[setDataset] = a[setDataset].concat(a['add']);
      b = JSON.parse(JSON.stringify(a));
      for (const team of b.teams) {
        team.players = team.players.map((player) => {
          return _.filter(
              a[setDataset],
              (dplayer) => dplayer._id == player._id,
          )[0];
        });
        if (team.key == teamKey) {
          if (a.allowPublicTeamView) {
            req.io.emit(team.key, team);
          }
        }
      }
      if (req.io) {
        await req.io.emit(req.params.auction_id, b);
      }
      return {status: 200, data: a};
    }, ERRCODE);
  },

  revertBid: async (req) => {
    return await trywrapper(async () => {
      /*
             Remove the player from team
             Add the sold price amt to team again
            */
      let a = await auction.findById(req.params.auction_id);

      const setDataset =
        a.poolingMethod == 'Composite' ? 'dPlayers' : 'cPlayers';
      let {update, filter} = getSoldPlayerQuery(
          setDataset,
          req.params.auction_id,
          req.body,
          true,
      );
      let result = await auction.updateOne(filter, {$unset: update});
      if (!result.matchedCount && !result.modifiedCount) {
        const {update, filter} = getSoldPlayerQuery(
            'add',
            req.params.auction_id,
            req.body,
            true,
        );
        result = await auction.updateOne(filter, {$unset: update});
        if (!result.matchedCount && !result.modifiedCount) {
          throw new Error('Player object not found !');
        }
      }
      filter = {
        'teams._id': mongoose.Types.ObjectId(req.body.player.team_id),
        'teams.players._id': mongoose.Types.ObjectId(req.body.player._id),
      };
      await auction.updateOne(filter, {
        $pull: {
          'teams.$.players': {_id: `${req.body.player._id}`},
        },
      });
      let b = await auction.findById(req.params.auction_id);
      let teamKey = null;
      for (const team of b.teams) {
        if (team._id == req.body.player.team_id) {
          _.remove(team.players, (obj) => obj._id == req.body.player._id);
          team.currentBudget += req.body.player.soldPrice;
          teamKey = team.key || null;
        }
      }
      await b.save();
      a = await auction.findById(req.params.auction_id);
      a[setDataset] = a[setDataset].concat(a.add);
      b = JSON.parse(JSON.stringify(b));
      b.teams.forEach((team) => {
        team.players = team.players.map((player) => {
          return _.filter(
              a[setDataset],
              (dplayer) => dplayer._id == player._id,
          )[0];
        });
        if (team.key == teamKey) {
          if (a.allowPublicTeamView) {
            req.io.emit(team.key, team);
          }
        }
      });
      b.password = undefined;
      a.password = undefined;
      if (req.io) {
        await req.io.emit(req.params.auction_id, b);
      }
      return {status: 200, data: a};
    }, ERRCODE);
  },
};
