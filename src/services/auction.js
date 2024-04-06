const Auction = require('../models/auction');
const bcrypt = require('bcrypt');
const Player = require('../models/player');
const {filterObject, trywrapper, decrypt} = require('../utils/index');
const {
  publicAuctionViewModel,
  AuctionViewModelAdmin,
} = require('../models/wimodels');
const {
  newAuctionAdminAuth,
  deleteAuctionAuth,
} = require('../utils/auctionAdminAuth');
const auctionPlayers = require('../models/auctionPlayers');
const ERRORCODE = 400;
module.exports = {
  getAuction: async () => {
    return await trywrapper(async () => {
      let result = await Auction.find();
      result = result.map((a) => filterObject(a, publicAuctionViewModel));
      return {status: true, data: result};
    });
  },

  getAuctionAdmin: async () => {
    return await trywrapper(async () => {
      let result = await Auction.find();
      result = result.map((a) => {
        a.password = undefined;
        return a;
      });
      // result = result.map((a) => filterObject(a, AuctionViewModelAdmin));
      return {status: true, data: result};
    });
  },

  updateAuctionAdmin: async (req) => {
    return await trywrapper(async () => {
      await Auction.findByIdAndUpdate(req.body.auction._id, req.body.auction);
      const auction = await Auction.findById(req.body.auction._id);
      auction.password = undefined;
      return {status: true, data: auction};
    }, ERRORCODE);
  },

  deleteAuctionAdmin: async (req) => {
    await Auction.findByIdAndDelete(req.body.auction._id);
    let auctions = await Auction.find();
    auctions = auctions.map((a) => filterObject(a, AuctionViewModelAdmin));
    return {status: true, data: auctions};
  },

  addAuction: async (req) => {
    return await trywrapper(async () => {
      // Check the admin id
      const result = await newAuctionAdminAuth(req.body.adminId);
      if (!result) {
        throw new Error('Admin ID incorrect !');
      }
      auctionJson = req.body.auction;
      auctionJson.status = 'red';
      auctionJson.poolingMethod = 'Composite';
      auctionJson.maxPlayers = 11;
      auctionJson.allowPublicTeamView = true;
      auctionJson.allowLogin = true;
      auctionJson.allowRealtimeUpdates = true;
      auctionJson.password = await bcrypt.hash(
          decrypt.decrypt(auctionJson.password),
          5,
      );
      auctionJson.maxBudget = auctionJson.maxBudget ?
        auctionJson.maxBudget :
        1000;
      auctionJson.createdAt = new Date();
      // Deletion of code - issue 14 - Database changes
      // moving from embeded document structure to separate collection structure
      // removed array fields from the auction object namely players, rules, teams
      const auction = new Auction(auctionJson);
      const players = await Player.find();
      const auctionPlayersObject = new auctionPlayers({
        auctionId: auction._id,
        players,
      });
      await auctionPlayersObject.save();
      await auction.save();
      return {
        status: true,
        data: filterObject(auction, publicAuctionViewModel),
      };
    }, ERRORCODE);
  },
  updateAuction: async (req) => {
    return await trywrapper(async () => {
      await Auction.findByIdAndUpdate(req.body.auction._id, req.body.auction);
      const auction = await Auction.findById(req.body.auction._id);
      return {status: true, data: auction};
    }, ERRORCODE);
  },
  deleteAuction: async (req) => {
    return await trywrapper(async () => {
      const result = await deleteAuctionAuth(req.body.deleteId);
      if (!result) {
        throw new Error('Delete admin id incorrect !');
      }
      auctionJson = req.body.auction;
      await Auction.findByIdAndDelete(req.body.auction._id);
      return {status: true};
    }, ERRORCODE);
  },
};
