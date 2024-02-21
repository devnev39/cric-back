const Auction = require('../models/auction');
const bcrypt = require('bcrypt');
const player = require('../models/player');
const {filterObject, trywrapper, decrypt} = require('../utils/index');
const {
  publicAuctionViewModel,
  AuctionViewModelAdmin,
} = require('../models/wimodels');
const {
  newAuctionAdminAuth,
  deleteAuctionAuth,
} = require('../utils/auctionAdminAuth');
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
      const result = await newAuctionAdminAuth(auctionJson);
      if (!result) {
        throw new Error('Admin ID incorrect !');
      }
      auctionJson.status = 'red';
      auctionJson.poolingMethod = 'Composite';
      auctionJson.maxPlayers = 11;
      auctionJson.allowPublicTeamView = true;
      auctionJson.allowLogin = true;
      auctionJson.password = await bcrypt.hash(
          decrypt.decrypt(auctionJson.password),
          5,
      );
      const a = new Auction(auctionJson);
      a.dPlayers = await player.find();
      await a.save();
      return {status: 200};
    }, ERRORCODE);
  },
  updateAuction: async (auctionJson) => {
    return await trywrapper(async () => {
      await Auction.findByIdAndUpdate(auctionJson._id, auctionJson);
      return {status: 200};
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
