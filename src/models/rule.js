const mongoose = require('mongoose');

const ruleSchema = mongoose.Schema({
  auctionId: String,
  name: String,
  rule: String,
  type: String,
});

module.exports = mongoose.model('Rule', ruleSchema);
