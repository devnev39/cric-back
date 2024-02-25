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
    .route('/team')
    .get(middlewares.auth.auctionAuth, routes.teams.getAllTeams)
    .post(
        middlewares.auth.auctionAuth,
        middlewares.teamFilter,
        routes.teams.addTeam,
    );

router
    .route('/team/:teamId')
    .delete(middlewares.auth.auctionAuth, routes.teams.deleteTeam)
    .put(
        middlewares.auth.auctionAuth,
        middlewares.teamFilter,
        routes.teams.updateTeam,
    );

router
    .route('/team/auction/:auctionId')
    .get(middlewares.auth.auctionAuth, routes.teams.getAllAuctionTeams);

router
    .route('/auction/:auctionId/players')
    .get(middlewares.auth.auctionAuth, routes.players.getPlayers)
    .post(middlewares.auth.auctionAuth, routes.players.addPlayers)
    .patch(middlewares.auth.auctionAuth, routes.players.movePlayers)
    .put(middlewares.auth.auctionAuth, routes.players.updatePlayers)
    .delete(middlewares.auth.auctionAuth, routes.players.deletePlayers)
    .copy(middlewares.auth.auctionAuth, routes.players.uploadPlayers);

router
    .route('/auction/:auctionId/bid')
    .post(middlewares.auth.auctionAuth, routes.bid.placeBid)
    .delete(middlewares.auth.auctionAuth, routes.bid.revertBid);

router
    .route('/rule/:auctionId')
    .get(middlewares.auth.auctionAuth, routes.rule.getRules)
    .delete(middlewares.auth.auctionAuth, routes.rule.deleteRule);

router.route('/rule').post(middlewares.auth.auctionAuth, routes.rule.addRule);

module.exports = router;
