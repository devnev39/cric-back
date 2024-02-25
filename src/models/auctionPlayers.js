const mongoose = require('mongoose');
const player = require('./player');

const auctionPlayersSchema = mongoose.Schema({
  auctionId: String,
  usedDataset: String,
  defaultPlayers: [player.schema],
  customPlayers: [player.schema],
  addedPlayers: [player.schema],
  removedPlayers: [player.schema],
});

module.exports = mongoose.model('auctionPlayers', auctionPlayersSchema);
