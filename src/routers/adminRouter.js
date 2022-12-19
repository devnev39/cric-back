require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");

const routes = require("../routes/adminRouter/index");
const middlewares = require("../middleware/index");
const router = express.Router();

router.use(fileUpload());

router.use(middlewares.auth.adminAuth);

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
.delete(routes.auction.delete)
.put(routes.auction.put)

module.exports = router;