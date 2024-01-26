const {
  addPlayers,
  updatePlayer,
  deletePlayer,
  getPlayers,
  poolPlayers,
  movePlayer,
  uploadPlayers,
} = require('../../services/players');
const {resultwrapper} = require('../../utils');

module.exports = {
  addPlayers: async (req, res) =>
    await resultwrapper(addPlayers, req, res, req),
  updatePlayers: async (req, res) =>
    await resultwrapper(updatePlayer, req, res, req),
  deletePlayers: async (req, res) =>
    await resultwrapper(deletePlayer, req, res, req),
  getPlayers: async (req, res) =>
    await resultwrapper(getPlayers, req, res, req),
  poolPlayers: async (req, res) =>
    await resultwrapper(poolPlayers, req, res, req),
  movePlayers: async (req, res) =>
    await resultwrapper(movePlayer, req, res, req),
  uploadPlayers: async (req, res) =>
    await resultwrapper(uploadPlayers, req, res, req),
};
