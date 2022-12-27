require("dotenv").config();
const express = require("express");
const middlewares = require("../middleware/index");
const routes = require("../routes/auctionRouter/index");

const router = express.Router();

router.route("/auction/:auction_id")
.get(middlewares.auth.auctionAuth,routes.getAuction)

module.exports = router;