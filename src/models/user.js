const mongoose = require("mongoose")

const userShcema = mongoose.Schema({
    Name : String,
    Username : String,
    Password : String,
    created_at : String
});

module.exports = mongoose.model("User", userShcema);