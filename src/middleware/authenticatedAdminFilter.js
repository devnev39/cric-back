// const auction = require("../models/auction");
const {trywrapper, error} = require('../utils');

module.exports = async (req, res, next) => {
  const resp = await trywrapper(async () => {
    console.log(req.session);
    if (req.session.isAuctionAuthenticated) {
      throw error('Log out of auction first !');
    }
    if (req.session.isAdminAuthenticated) {
      return {status: true, errorCode: 601};
    } else {
      return {status: false, errorCode: 401};
    }
  }, 605);
  if (resp) {
    res.json(resp);
    return;
  }
  next();
};
