const mongoose = require('mongoose');
const auctionSchema = mongoose.Schema({
  name: String,
  maxBudget: Number,
  password: String,
  status: String,
  poolingMethod: String,
  maxPlayers: Number,
  allowPublicTeamView: Boolean,
  allowLogin: Boolean,
});

module.exports = mongoose.model('Auction', auctionSchema);
