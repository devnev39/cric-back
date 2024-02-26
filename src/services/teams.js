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
      return {status: true, data: teams};
    }, ERRORCODE);
  },
  getAllTeams: async (req) => {
    return await utils.trywrapper(async () => {
      const teams = await Team.find({acutionId: req.params.auctionId});
      return {status: true, data: teams};
    }, ERRORCODE);
  },
  getTeam: async (req) => {
    return await utils.trywrapper(async () => {
      const team = Team.findById(req.params.teamId);
      if (team) {
        return {status: true, data: team};
      }
      throw new Error('Team not found !');
    }, ERRORCODE);
  },
  addTeam: async (req) => {
    return await utils.trywrapper(async () => {
      // Issue 14 (devnev39/cric-front) - Database strucutre change
      req.body.team.currentBudget = req.body.team.budget;
      req.body.team.key = crypto.randomBytes(3).toString('hex');
      const t = new Team(req.body.team);
      await t.save();

      // TODO: Redesign the socket data flow

      return {status: true, data: t};
    }, ERRORCODE);
  },
  deleteTeam: async (req) => {
    return await utils.trywrapper(async () => {
      await Team.deleteOne({_id: req.params.teamId});
      return {status: true};
    }, ERRORCODE);
  },
  updateTeam: async (req) => {
    return await utils.trywrapper(async () => {
      let team = await Team.findById(req.params.teamId);
      await team.update(req.body.team);
      team = await Team.findById(req.params.teamId);
      return {status: true, data: team};
    }, ERRORCODE);
  },
};
