const mongoose = require("mongoose");
const player = require("./player");

const playerShema = mongoose.Schema({
    Player : player.schema,
    Soldprice : Number,
    Sold : String
});

module.exports = mongoose.model("SPlayer",playerShema);