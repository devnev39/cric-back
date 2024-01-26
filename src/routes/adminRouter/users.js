const userService = require('../../services/users');
const {resultwrapper} = require('../../utils');

module.exports = {
  get: async (req, res) => await resultwrapper(userService.getUsers, req, res),
  post: async (req, res) =>
    await resultwrapper(userService.addUser, req, res, req),
  put: async (req, res) =>
    await resultwrapper(userService.updateUser, req, res, req),
  delete: async (req, res) =>
    await resultwrapper(userService.removeUser, req, res, req),
};
