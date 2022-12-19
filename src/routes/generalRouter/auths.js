const utils = require("../../utils");
module.exports = {
    auctionAuth : async (req,res) => {
        // Decrypt password
        // With bcrypt check it with required auction
        // Return {status : 200}
        await utils.Auths.auctionAuth(req,res);
    },
    adminAuth : async (req,res) => {
        // Decrypt password
        // Check the admin password against ours
        // Return status
        utils.Auths.adminAuth(req,res);
    }
}