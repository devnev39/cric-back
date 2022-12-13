require("dotenv").config();
const express = require("express");

const adminRouter = require('./routers/adminRouter');
const generalRouter = require('./routers/generalRouter');
const auctionRouter = require("./routers/auctionRouter");

const app = express();

app.use([auctionRouter,generalRouter,adminRouter]);

module.exports = app;