require("dotenv").config();
const express = require("express");

const adminRouter = require('./routers/adminRouter');
const generalRouter = require('./routers/generalRouter');

const app = express();

app.use([adminRouter,generalRouter]);

module.exports = app;