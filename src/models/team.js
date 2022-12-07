const mongoose = require("mongoose");
const Player = require("./soldPlayer");

const teamSchema = mongoose.Schema({
    No : Number,
    Name : String,
    Budget : Number,
    Current : Number,
    Players : {type : [Player.schema]},
    Score : Number
});

module.exports = mongoose.model("Team",teamSchema);