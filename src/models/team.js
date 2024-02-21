const mongoose = require('mongoose');
const Player = require('./soldPlayer');

const teamSchema = mongoose.Schema({
  name: String,
  budget: Number,
  currentBudget: Number,
  key: String,
  auctionMaxBudget: Number,
  players: {type: [Player.schema]},
  score: Number,
});

module.exports = mongoose.model('Team', teamSchema);
