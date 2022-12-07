const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({
    SRNO : Number,
    Name : String,
    Country : String,
    PlayingRole : String,
    IPLMatches : Number,
    CUA : String,
    BasePrice : Number,
    IPL2022Team : String,
    AuctionedPrice : Number,
    IMGURL : String
});

module.exports = mongoose.model('Player',playerSchema);