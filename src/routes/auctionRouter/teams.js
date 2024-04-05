const {
  addTeam,
  updateTeam,
  deleteTeam,
  getTeam,
  getAllTeams,
  getAllAuctionTeams,
} = require('../../services/teams');
const {resultwrapper} = require('../../utils');

module.exports = {
  addTeam: async (req, res) => await resultwrapper(addTeam, req, res, req),
  updateTeam: async (req, res) =>
    await resultwrapper(updateTeam, req, res, req),
  deleteTeam: async (req, res) =>
    await resultwrapper(deleteTeam, req, res, req),
  getTeam: async (req, res) => await resultwrapper(getTeam, req, res, req),
  getAllTeams: async (req, res) =>
    await resultwrapper(getAllTeams, req, res, req),
  getAllAuctionTeams: async (req, res) =>
    await resultwrapper(getAllAuctionTeams, req, res, req),
};
