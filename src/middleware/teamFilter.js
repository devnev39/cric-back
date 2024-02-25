// Team filter will check for team and auction object
// Also team budget
const auction = require('../models/auction');
const ERRORCODE = 305;
const error = require('../utils/error');
const teamFilter = async (req, res, next) => {
  const a = await auction.findById(req.body.team.auctionId);
  if (!a) {
    error(res, ERRORCODE, 'Document with id not found !');
    return;
  }
  if (req.body.team.budget > a.maxBudget) {
    error(res, ERRORCODE, 'Cannot set team budget more than set by auction !');
    return;
  }
  next();
};

module.exports = teamFilter;
