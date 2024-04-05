const mongoose = require('mongoose');
const player = require('./player');

const auctionPlayersSchema = mongoose.Schema({
  auctionId: String,
  useCustom: Boolean,
  players: [player.schema],
  customPlayers: [player.schema],
});

module.exports = mongoose.model('auctionPlayers', auctionPlayersSchema);
