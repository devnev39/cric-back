const auction = require('../../models/auction');
const player = require('../../models/player');
const team = require('../../models/team');
const queryRunner = require('../../services/queryRunner');
const utils = require('../../utils');

module.exports = {
  playersq: async (req, res) => {
    await utils.resultwrapper(
        async () => {
          return await queryRunner(player, req.body.query);
        },
        req,
        res,
    );
  },
  teamsq: async (req, res) => {
    await utils.resultwrapper(
        async () => {
          return await queryRunner(team, req.body.query);
        },
        req,
        res,
    );
  },
  auctionq: async (req, res) => {
    await utils.resultwrapper(
        async () => {
          return await queryRunner(auction, req.body.query);
        },
        req,
        res,
    );
  },
};
