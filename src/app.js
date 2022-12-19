require("dotenv").config();
const express = require("express");
const session = require("express-session");
const adminRouter = require('./routers/adminRouter');
const generalRouter = require('./routers/generalRouter');
const auctionRouter = require("./routers/auctionRouter");
const bodyParser = require("body-parser");
const production = process.env.NODE_ENV === 'production';
const app = express();

app.use(session({
    secret : process.env.SESS_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : production
    }
}));

app.use(bodyParser.json());
app.use((err,req,res,next) => {
    if(err) res.json({status : 500,data : err});
    else next();
});

app.use([auctionRouter,generalRouter,adminRouter]);

module.exports = app;