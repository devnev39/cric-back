const auction = require('../models/auction');
const player = require('../models/player');
const team = require('../models/team');
const error = require('../utils/error');
const ERRORCODE = 315;

const commonFilter = (req, res, next, model) => {
  if (!req.body.query) {
    error(res, ERRORCODE, 'Query object not found !');
    return;
  }
  // if((valid = validator.queryValidator(req.body.query,model)) != true){ error(res,ERRORCODE,valid);return;}
  // if(req.body.query.limit < 1){error(res,ERRORCODE,"Limit cannot be less than 1 !");return}
  // if(req.body.query.order != -1 && req.body.query.order != 1){error(res,ERRORCODE,"Order must be 1 or -1 only !");return;}
  next();
};

module.exports.playerQueryFilter = (req, res, next) => {
  commonFilter(req, res, next, player);
};

module.exports.teamQueryFilter = (req, res, next) => {
  commonFilter(req, res, next, team);
};

module.exports.auctionQueryFilter = (req, res, next) => {
  commonFilter(req, res, next, auction);
};
