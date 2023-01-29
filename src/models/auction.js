const mongoose = require("mongoose");
const player = require("./player");
const Team = require("./team");

const auctionShema = mongoose.Schema({
    No : Number,
    Name : String,
    MaxBudget : Number,
    Password : String,
    Status : String,
    poolingMethod : String,
    Teams : [Team.schema],
    Add : [player.schema],
    Rmv : [player.schema],
    dPlayers : [player.schema],
    cPlayers : [player.schema]
});

module.exports = mongoose.model("Auction",auctionShema);