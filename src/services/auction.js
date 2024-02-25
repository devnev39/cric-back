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
      return {status: 200, data: result};
    });
  },

  getAuctionAdmin: async () => {
    return await trywrapper(async () => {
      let result = await Auction.find();
      result = result.map((a) => filterObject(a, AuctionViewModelAdmin));
      return {status: 200, data: result};
    });
  },

  updateAuctionAdmin: async (auctionJson) => {
    return await trywrapper(async () => {
      await Auction.findByIdAndUpdate(auctionJson._id, auctionJson);
      let auctions = await Auction.find();
      auctions = auctions.map((a) => filterObject(a, AuctionViewModelAdmin));
      return {status: 200, data: auctions};
    }, ERRORCODE);
  },

  deleteAuctionAdmin: async (auctionJson) => {
    await Auction.findByIdAndDelete(auctionJson._id);
    let auctions = await Auction.find();
    auctions = auctions.map((a) => filterObject(a, AuctionViewModelAdmin));
    return {status: 200, data: auctions};
  },

  addAuction: async (auctionJson) => {
    return await trywrapper(async () => {
      // Check the admin id
      const result = await newAuctionAdminAuth(auctionJson.adminId);
      if (!result) {
        throw new Error('Admin ID incorrect !');
      }
      auctionJson = auctionJson.auction;
      auctionJson.status = 'red';
      auctionJson.poolingMethod = 'Composite';
      auctionJson.maxPlayers = 11;
      auctionJson.allowPublicTeamView = true;
      auctionJson.allowLogin = true;
      auctionJson.password = await bcrypt.hash(
          decrypt.decrypt(auctionJson.password),
          5,
      );
      auctionJson.maxBudget = auctionJson.maxBudget ?
        auctionJson.maxBudget :
        1000;
      // Deletion of code - issue 14 - Database changes
      // moving from embeded document structure to separate collection structure
      // removed array fields from the auction object namely players, rules, teams
      const auction = new Auction(auctionJson);
      const players = await Player.find();
      const auctionPlayersObject = new auctionPlayers({
        auctionId: auction._id,
        defaultPlayers: players,
      });
      await auctionPlayersObject.save();
      await auction.save();
      return {
        status: 200,
        data: filterObject(auction, publicAuctionViewModel),
      };
    }, ERRORCODE);
  },
  updateAuction: async (auctionJson) => {
    return await trywrapper(async () => {
      await Auction.findByIdAndUpdate(auctionJson._id, auctionJson);
      const auction = await Auction.findById(auctionJson._id);
      return {status: 200, data: auction};
    }, ERRORCODE);
  },
  deleteAuction: async (auctionJson) => {
    return await trywrapper(async () => {
      const result = await deleteAuctionAuth(auctionJson.deleteId);
      if (!result) {
        throw new Error('Delete admin id incorrect !');
      }
      auctionJson = auctionJson.auction;
      await Auction.findByIdAndDelete(auctionJson._id);
      return {status: 200};
    }, ERRORCODE);
  },
};
