const mongoose = require('mongoose');

const tempUserSchema = mongoose.Schema({
  email: String,
  name: String,
  pat: String,
  expiry: String,
  enabled: Boolean,
});

module.exports = mongoose.model('TempUser', tempUserSchema);
