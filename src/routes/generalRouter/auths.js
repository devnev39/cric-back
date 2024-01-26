const utils = require('../../utils');
module.exports = {
  auctionAuth: async (req, res) => {
    // Decrypt password
    // With bcrypt check it with required auction
    // Return {status : 200}
    await utils.Auths.auctionAuth(req, res);
  },
  adminAuth: async (req, res) => {
    // Decrypt password
    // Check the admin password against ours
    // Return status
    utils.Auths.adminAuth(req, res);
  },
  logoutAuction: async (req, res) => {
    if (req.session) {
      if (
        req.session.isAuctionAuthenticated &&
        req.session.authenticatedAuctionId
      ) {
        req.session.isAuctionAuthenticated = false;
        req.session.authenticatedAuctionId = undefined;
        res.json({status: 200});
      } else if (req.session.isAdminAuthenticated) {
        req.session.isAdminAuthenticated = false;
        res.json({status: 200});
      } else {
        res.json({status: 510, data: 'No authenticated auction !'});
      }
    }
  },
};
