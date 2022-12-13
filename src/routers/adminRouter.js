require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const routes = require("../routes/adminRouter/index");
const middlewares = require("../middleware/index");

const production = process.env.NODE_ENV === 'production';

const router = express.Router();
const ERRORCODE = 500;

router.use(session({
    secret : process.env.SESS_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : production
    }
}));
router.use(fileUpload());
router.use(bodyParser.json());
router.use((err,req,res,next) => {
    if(err) res.json({status : ERRORCODE,data : err});
    else next();
});

router.post("/auth",routes.auth);

router.use(middlewares.auth);

router.route("/players")
.get(routes.players.get)
.post(middlewares.upload,routes.players.post)
.delete(routes.players.delete)
.put(routes.players.put)

router.route("/teams")
.get(routes.teams.get)
.post(middlewares.teamFilter,routes.teams.post)
.delete(routes.teams.delete)
.put(routes.teams.put)

router.route("/auction")
.get(routes.auction.get)
.post(middlewares.auctionFilter,routes.auction.post)
.delete(routes.auction.delete)
.put(routes.auction.put)

module.exports = router;