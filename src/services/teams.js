// const _ = require('lodash');
const crypto = require('crypto');
// const Auction = require('../models/auction');
const Team = require('../models/team');
const utils = require('../utils/index');
const ERRORCODE = 420;
module.exports = {
  getAllAuctionTeams: async (req) => {
    return await utils.trywrapper(async () => {
      const teams = await Team.find({auctionId: req.params.auctionId});
      return {status: 200, data: teams};
    }, ERRORCODE);
  },
  getAllTeams: async (req) => {
    return await utils.trywrapper(async () => {
      const teams = await Team.find({acutionId: req.params.auctionId});
      return {status: 200, data: teams};
    }, ERRORCODE);
  },
  getTeam: async (req) => {
    return await utils.trywrapper(async () => {
      const team = Team.findById(req.params.teamId);
      if (team) {
        return {status: 200, data: team};
      }
      throw new Error('Team not found !');
      // const id = req.params.teamId;
      // let a = await Auction.find({'team.key': id});
      // a = a[0];
      // if (!a) {
      //   throw new Error('Auction not found !');
      // }
      // if (!a.allowPublicTeamView) {
      //   throw new Error('Live feed disabled !');
      // }
      // const setDataset =
      //   a.poolingMethod == 'Composite' ? 'dPlayers' : 'cPlayers';
      // let team = null;
      // for (const t of a.teams) {
      //   if (t.key == id) {
      //     team = t;
      //   }
      // }
      // // const b = JSON.parse(JSON.stringify(a));
      // team = JSON.parse(JSON.stringify(team``));
      // if (team) {
      //   team.players = team.players.map((player) => {
      //     return _.filter(
      //         a[setDataset],
      //         (dplayer) => dplayer._id == player._id,
      //     )[0];
      //   });
      // }
      // return {status: 200, data: team};
    }, ERRORCODE);
  },
  addTeam: async (req) => {
    return await utils.trywrapper(async () => {
      // Issue 14 (devnev39/cric-front) - Database strucutre change
      // const a = await Auction.findById(req.params.auction_id);
      // const setDataset =
      //   a.poolingMethod == 'Composite' ? 'dPlayers' : 'cPlayers';
      req.body.team.currentBudget = req.body.team.budget;
      req.body.team.key = crypto.randomBytes(3).toString('hex');
      const t = new Team(req.body.team);
      await t.save();
      // a.teams.push(t):
      // await a.save();
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

      // TODO: Redesign the socket data flow

      // if (req.io) {
      //   await req.io.emit(req.params.auction_id, b);
      // }
      return {status: 200, data: t};
    }, ERRORCODE);
  },
  deleteTeam: async (req) => {
    return await utils.trywrapper(async () => {
      // const a = await Auction.findById(req.params.auction_id);
      // Issue 14 - (devnev39/cric-auction)
      // const setDataset =
      //   a.poolingMethod == 'Composite' ? 'dPlayers' : 'cPlayers';
      // a.teams.pull({_id: req.params.teamId});
      // await a.save();
      // const team = await Team.findById(req.params.teamId);
      // console.log(req.params.teamId);
      await Team.deleteOne({_id: req.params.teamId});
      // console.log(result);
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
    }, ERRORCODE);
  },
  updateTeam: async (req) => {
    return await utils.trywrapper(async () => {
      // await Auction.findOneAndUpdate(
      //     {'_id': req.params.auction_id, 'teams._id': req.params.teamId},
      //     {
      //       $set: {
      //         'teams.$.name': req.body.team.name,
      //         'teams.$.budget': req.body.team.budget,
      //       },
      //     },
      // );
      // const a = await Auction.findById(req.params.auction_id);
      // const setDataset =
      //   a.poolingMethod == 'Composite' ? 'dPlayers' : 'cPlayers';
      // b = JSON.parse(JSON.stringify(a));
      // b.cPlayers = null;
      // b.dPlayers = null;
      // for (const team of b.team) {
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
      let team = await Team.findById(req.params.teamId);
      await team.update(req.body.team);
      team = await Team.findById(req.params.teamId);
      return {status: 200, data: team};
    }, ERRORCODE);
  },
};
