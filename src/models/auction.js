const mongoose = require('mongoose');
const player = require('./player');
const Team = require('./team');
const Rule = require('./rule');

const auctionSchema = mongoose.Schema({
  name: String,
  maxBudget: Number,
  password: String,
  status: String,
  poolingMethod: String,
  maxPlayers: Number,
  allowPublicTeamView: Boolean,
  allowLogin: Boolean,
  rules: [Rule.schema],
  teams: [Team.schema],
  add: [player.schema],
  rmv: [player.schema],
  dPlayers: [player.schema], // Default players
  cPlayers: [player.schema], // Custom players uploaded by user
});

module.exports = mongoose.model('Auction', auctionSchema);
