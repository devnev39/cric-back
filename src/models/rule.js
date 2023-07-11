const mongoose = require("mongoose");

const ruleSchema = mongoose.Schema({
    ruleName : String, 
    rule : String,
    type : String
});

module.exports = mongoose.model('Rule',ruleSchema);