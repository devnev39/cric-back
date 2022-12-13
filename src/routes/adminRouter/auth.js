require("dotenv").config();
const bcrypt = require("bcrypt");

const auth = (req,res) => {
    bcrypt.compare(req.body.key,process.env.ADMIN,(err,result) => {
        if(err) {}
        if(req.session) req.session.isAuthenticated = result;
        if(result) res.json({status : 200});
        else res.json({status : 505});
    });
}

module.exports = auth;