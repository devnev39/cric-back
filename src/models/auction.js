const mongoose = require("mongoose");
const player = require("./player");
const Team = require("./team");
const Rule = require("./rule");

const auctionSchema = mongoose.Schema({
    No : Number,
    Name : String,
    MaxBudget : Number,
    Password : String,
    Status : String,
    poolingMethod : String,
    MaxPlayers: Number,
    AllowPublicTeamView: Boolean,
    AllowLogin: Boolean,
    Rules : [Rule.schema],
    Teams : [Team.schema],
    Add : [player.schema],
    Rmv : [player.schema],
    dPlayers : [player.schema],
    cPlayers : [player.schema]
});

module.exports = mongoose.model("Auction",auctionSchema);