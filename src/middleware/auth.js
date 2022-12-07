const ERRORCODE = 505;
const error = require("../utils/error");
const auth = (req,res,next) => {
    if(!req.session.isAuthenticated){
        // Status 505 means authentication
        // Post key to /auth for authentication
        // If not authenticated invoke error util
        error(res,ERRORCODE,"Enter valid key !");
    }else next();
}

module.exports = auth;