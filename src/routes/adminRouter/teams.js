const teamService = require('../../services/teams');
const utils = require('../../utils/index');

module.exports = {
  get: async (req, res) => {
    await utils.resultwrapper(teamService.getTeam, req, res);
  },
  post: async (req, res) => {
    await utils.resultwrapper(teamService.addTeam, req, res, req.body.team);
  },
  delete: async (req, res) => {
    await utils.resultwrapper(teamService.deleteTeam, req, res, req.body.team);
  },
  put: async (req, res) => {
    await utils.resultwrapper(teamService.updateTeam, req, res, req.body.team);
  },
};
