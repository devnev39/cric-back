const mongoose = require('mongoose');
const auctionSchema = mongoose.Schema({
  name: String,
  maxBudget: Number,
  password: String,
  status: String,
  poolingMethod: String,
  maxPlayers: Number,
  priceUnit: String,
  allowPublicTeamView: Boolean,
  allowRealtimeUpdates: Boolean,
  allowLogin: Boolean,
  createdAt: Date,
  freeze: Boolean,
});

module.exports = mongoose.model('Auction', auctionSchema);
