const mongoose = require('mongoose');

const userShcema = mongoose.Schema({
  name: String,
  username: String,
  password: String,
  created_at: String,
});

module.exports = mongoose.model('User', userShcema);
