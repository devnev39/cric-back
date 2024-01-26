require('dotenv').config();
const auction = require('../models/auction');
const bcrypt = require('bcrypt');
const decrypt = require('./decrypt');
const trywrapper = require('./trywrapper');

module.exports = {
  _auctionAuth: async (req, res) => {
    const response = await trywrapper(async () => {
      const a = await auction.findById(req.body._id);
      const pass = decrypt.decrypt(req.body.Password);
      const result = await bcrypt.compare(pass, a.Password);
      if (result && req.session) {
        if (req.session.isAdminAuthenticated) {
          throw new Error(
              'Cannot give admin access without logging out from admin panel !',
          );
        }
        if (a.AllowLogin) {
          req.session.isAuctionAuthenticated = result;
          req.session.authenticatedAuctionId = req.body._id;
        } else {
          throw new Error('Login blocked by admin !');
        }
      }
      if (result) {
        return {status: 200};
      } else {
        return {status: 510, data: 'Incorrect credintials !'};
      }
    }, 510);
    res.json(response);
  },
  get auctionAuth() {
    return this._auctionAuth;
  },
  set auctionAuth(value) {
    this._auctionAuth = value;
  },
  adminAuth: async (req, res) => {
    const response = await trywrapper(async () => {
      const pass = decrypt.decrypt(req.body.password);
      const result = await bcrypt.compare(pass, process.env.ADMIN);
      if (req.session) {
        if (req.session.isAuctionAuthenticated) {
          throw new Error(
              'Cannot give admin access without loggin out auction !',
          );
        } else {
          req.session.isAdminAuthenticated = result;
        }
      } else {
        throw new Error('Cookie error at server !');
      }
      if (result) {
        return {status: 200};
      } else {
        return {status: 505, data: 'Incorrect credintials !'};
      }
    }, 505);
    res.json(response);
  },
};
