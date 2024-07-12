const utils = require('../../utils');
const ERRCODE = 510;
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
  /**
   * Logs out the auction session.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} A promise that resolves when the logout is complete.
   */
  logoutAuction: async (req, res) => {
    if (req.session) {
      if (
        req.session.isAuctionAuthenticated &&
        req.session.authenticatedAuctionId
      ) {
        req.session.isAuctionAuthenticated = false;
        req.session.authenticatedAuctionId = undefined;
        res.json({status: true});
      } else if (req.session.isAdminAuthenticated) {
        req.session.isAdminAuthenticated = false;
        res.json({status: true});
      } else {
        res.json({
          status: false,
          errorCode: ERRCODE,
          data: 'No authenticated auction !',
        });
      }
    }
  },
};
