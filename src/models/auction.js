const mongoose = require("mongoose");
const Team = require("./team");

const auctionShema = mongoose.Schema({
    No : Number,
    Name : String,
    MaxBudget : Number,
    Teams : [Team.schema]
});

module.exports = mongoose.model("Auction",auctionShema);