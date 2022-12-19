require("dotenv").config();
const express = require("express");
const routes = require("../routes/auctionRouter/index");

const auctionRouter = express.Router();

module.exports = auctionRouter;