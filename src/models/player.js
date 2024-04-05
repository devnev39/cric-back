const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  name: String,
  country: String,
  playingRole: String,
  iplMatches: Number,
  cua: String, // Capped uncapped
  basePrice: Number,
  ipl2022Team: String,
  auctionedPrice: Number,
  totalRuns: Number,
  battingAvg: Number,
  strikeRate: Number,
  wickets: Number,
  economy: Number,
  imgUrl: String,
  isEdited: Boolean,
  isAdded: Boolean,
  includeInAuction: Boolean,
  sold: Boolean,
  soldPrice: Number,
  team_id: String,
  teamName: String,
});

module.exports = mongoose.model('Player', playerSchema);
