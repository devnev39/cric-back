const express = require("express");
const middlewares = require("../middleware/index");
const routes = require("../routes/generalRouter/index");
const teamRoutes = require("../routes/auctionRouter/teams")

const router = express.Router();

router.route("/auth/auction/:auction_id")
.post(routes.auths.auctionAuth)

router.route("/auth/admin")
.post(routes.auths.adminAuth)

router.route("/wimodels/:model")
.get(routes.wimodels)

router.route("/player/query")
.post(middlewares.queryFilter.playerQueryFilter,routes.queries.playersq)

router.route("/team/query")
.post(middlewares.queryFilter.teamQueryFilter,routes.queries.teamsq)

router.route("/teams/:teamId")
.get(teamRoutes.getTeam)

router.route("/auction/query")
.post(middlewares.queryFilter.auctionQueryFilter,routes.queries.auctionq)

router.route("/auction")
.get(middlewares.authenticatedAuctionFilter,routes.auction.get)
.post(middlewares.auctionFilter,routes.auction.post)

router.route("/admin")
.get(middlewares.authenticateAdminFilter)

router.get("/logout",routes.auths.logoutAuction);

module.exports = router;