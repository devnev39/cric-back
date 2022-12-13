const express = require("express");
const bodyParser = require("body-parser");
const modelSchema = require("../routes/generalRouter/modelSchema");
// const home = require("../routes/home");

const router = express.Router();
router.use(bodyParser.json());

router.route("/models/:model")
.get(modelSchema)

module.exports = router;