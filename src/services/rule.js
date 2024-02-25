// const _ = require('lodash');
// const auction = require('../models/auction');
const {trywrapper} = require('../utils');
const Rule = require('../models/rule');
const ERRCODE = 801;

module.exports = {
  getRules: async (req) => {
    return await trywrapper(async () => {
      const rules = await Rule.find({auctionId: req.params.auctionId});
      return {status: 200, data: rules};
    }, ERRCODE);
  },
  addRule: async (req) => {
    return await trywrapper(async () => {
      // Issue 14 - (devnev39/cric-front)
      // const a = await auction.findById(req.params.auction_id);
      // const setDataset =
      //   a.poolingMethod == 'Composite' ? 'dPlayers' : 'cPlayers';
      // if (!req.body.rule) {
      //   throw new Error('Rule not found !');
      // }
      const rule = new Rule(req.body.rule);
      // a.rules.push(rule);
      await rule.save();
      // await a.save();

      // TODO: write comment about the need and working of this copying

      // const b = JSON.parse(JSON.stringify(a));
      // b.dPlayers = null;
      // b.dPlayers = null;
      // for (const team of b.teams) {
      //   team.players = team.players.map((player) => {
      //     return _.filter(
      //         a[setDataset],
      //         (dplayer) => dplayer._id == player._id,
      //     )[0];
      //   });
      // }
      // if (req.io) {
      //   await req.io.emit(req.params.auction_id, b);
      // }
      return {status: 200, data: rule};
    }, ERRCODE);
  },

  deleteRule: async (req) => {
    return await trywrapper(async () => {
      await Rule.deleteOne({_id: req.params.ruleId});
      // const a = await auction.findById(req.params.auction_id);
      // const setDataset =
      //   a.poolingMethod == 'Composite' ? 'dPlayers' : 'cPlayers';
      // if (!req.body.rule) {
      //   throw new Error('Rule not found !');
      // }
      // a.rules.pull({_id: req.body.rule._id});
      // await a.save();

      // // TODO: write comment about the need and working of this copying

      // b = JSON.parse(JSON.stringify(a));
      // b.cPlayers = null;
      // b.dPlayers = null;
      // for (const team of b.Teams) {
      //   team.players = team.players.map((player) => {
      //     return _.filter(
      //         a[setDataset],
      //         (dplayer) => dplayer._id == player._id,
      //     )[0];
      //   });
      // }
      // if (req.io) {
      //   await req.io.emit(req.params.auction_id, b);
      // }
      return {status: 200};
    }, ERRCODE);
  },
};
