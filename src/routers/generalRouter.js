const express = require("express");
const bodyParser = require("body-parser");
const home = require("../routes/home");

const router = express.Router();
router.use(bodyParser.json());

router.get("/",home);

module.exports = router;