const mongoose = require('mongoose');

const tempUserSchema = mongoose.Schema({
  Email: String,
  Name: String,
  PAT: String,
  Expiry: String,
  Enabled: Boolean,
});

module.exports = mongoose.model('TempUser', tempUserSchema);
