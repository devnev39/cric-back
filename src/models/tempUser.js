const mongoose = require('mongoose');

// Will have access to default player set in players collection

const tempUserSchema = mongoose.Schema({
  email: String,
  name: String,
  pat: String,
  expiry: String,
  enabled: Boolean,
});

module.exports = mongoose.model('TempUser', tempUserSchema);
