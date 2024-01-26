require('dotenv').config();
const express = require('express');
const middlewares = require('../middleware/index');
const routes = require('../routes/auctionRouter/index');

const router = express.Router();

router
    .route('/auction/:auction_id')
    .get(middlewares.auth.auctionAuth, routes.getAuction)
    .put(middlewares.auth.auctionAuth, routes.updateAuction)
    .delete(middlewares.auth.auctionAuth, routes.deleteAuction);

router
    .route('/auction/:auction_id/teams')
    .post(
        middlewares.auth.auctionAuth,
        middlewares.teamFilter,
        routes.teams.addTeam,
    );

router
    .route('/auction/:auction_id/teams/:team_id')
    .delete(middlewares.auth.auctionAuth, routes.teams.deleteTeam)
    .put(
        middlewares.auth.auctionAuth,
        middlewares.teamFilter,
        routes.teams.updateTeam,
    );

router
    .route('/auction/:auction_id/players')
    .get(middlewares.auth.auctionAuth, routes.players.getPlayers)
    .post(middlewares.auth.auctionAuth, routes.players.addPlayers)
    .patch(middlewares.auth.auctionAuth, routes.players.movePlayers)
    .put(middlewares.auth.auctionAuth, routes.players.updatePlayers)
    .delete(middlewares.auth.auctionAuth, routes.players.deletePlayers)
    .copy(middlewares.auth.auctionAuth, routes.players.uploadPlayers);

router
    .route('/auction/:auction_id/bid')
    .post(middlewares.auth.auctionAuth, routes.bid.placeBid)
    .delete(middlewares.auth.auctionAuth, routes.bid.revertBid);

router
    .route('/auction/:auction_id/rule')
    .post(middlewares.auth.auctionAuth, routes.rule.addRule)
    .delete(middlewares.auth.auctionAuth, routes.rule.deleteRule);

module.exports = router;
