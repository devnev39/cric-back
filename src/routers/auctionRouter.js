require("dotenv").config();
const express = require("express");
// const session = require("express-session"); Not going to implement session now
const routes = require("../routes/auctionRouter/index");
const bodyParser = require("body-parser");
const middlewares = require("../middleware/index");

const auctionRouter = express.Router();

auctionRouter.use(bodyParser.json());

auctionRouter.route("/players/query")
.post(middlewares.queryFilter.playerQueryFilter,routes.playersq)

auctionRouter.route("/teams/query")
.post(middlewares.queryFilter.teamQueryFilter,routes.teamsq)

auctionRouter.route("/auction/query")
.post(middlewares.queryFilter.auctionQueryFilter,routes.auctionq)

module.exports = auctionRouter;