// Auction filter will check for the auction object and auction budget range

const ERRORCODE = 300;
const error = require('../utils/error');
const Auction = require('../models/auction');

const auctionFilter = async (req, res, next) => {
  if (!req.body.auction) {
    error(res, ERRORCODE, 'No auction object provided !');
    return;
  }
  if (req.body.auction.MaxBudget < 0 || req.body.auction.MaxBudget > 11000) {
    error(res, ERRORCODE, 'Invalid auction budget !');
    return;
  }
  const result = await Auction.find({No: req.body.auction.No});
  if (result.length) {
    error(res, ERRORCODE, 'Auction object with given No. exist !');
    return;
  }
  next();
};

module.exports = auctionFilter;
