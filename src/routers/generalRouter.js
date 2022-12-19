const express = require("express");
const middlewares = require("../middleware/index");
const routes = require("../routes/generalRouter/index");

const router = express.Router();

router.route("/auth/auctions/:auction_id")
.post(routes.auths.auctionAuth)

router.route("/auth/admin")
.post(routes.auths.adminAuth)

router.route("/wimodels/:model")
.get(routes.wimodels)

router.route("/player/query")
.post(middlewares.queryFilter.playerQueryFilter,routes.queries.playersq)

router.route("/team/query")
.post(middlewares.queryFilter.teamQueryFilter,routes.queries.teamsq)

router.route("/auction/query")
.post(middlewares.queryFilter.auctionQueryFilter,routes.queries.auctionq)

router.route("/auction")
.get(routes.auction.get)
.post(middlewares.auctionFilter,routes.auction.post)

module.exports = router;