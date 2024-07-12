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
  /**
   * Retrieves auction data asynchronously.
   *
   * @return {Object} Returns an object with status true and the auction data.
   */
  getAuction: async () => {
    return await trywrapper(async () => {
      let result = await Auction.find();
      result = result.map((a) => filterObject(a, publicAuctionViewModel));
      return {status: true, data: result};
    });
  },

  /**
   * Retrieves auction admin data asynchronously. (Without filtering)
   *
   * @return {Object} Returns an object with status true and the auction admin data.
   */
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

  /**
   * Updates an auction with admin previleges asynchronously.
   *
   * @param {Object} req - The request object containing the auction data.
   * @param {Object} req.body - The body of the request.
   * @param {Object} req.body.auction - The auction data to be updated.
   * @param {string} req.body.auction._id - The ID of the auction to be updated.
   * @return {Promise<Object>} Returns a promise that resolves to an object with the status and updated auction data.
   * The status is true and the data contains the updated auction with the password field removed.
   * @throws {Error} Throws an error with the specified ERRORCODE if the update fails.
   */
  updateAuctionAdmin: async (req) => {
    return await trywrapper(async () => {
      await Auction.findByIdAndUpdate(req.body.auction._id, req.body.auction);
      const auction = await Auction.findById(req.body.auction._id);
      auction.password = undefined;
      return {status: true, data: auction};
    }, ERRORCODE);
  },

  /**
   * Deletes an auction admin asynchronously.
   *
   * @param {Object} req - The request object containing the auction data.
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.auction._id - The ID of the auction to be deleted.
   * @return {Object} Returns an object with the status and deleted auctions data.
   */
  deleteAuctionAdmin: async (req) => {
    await Auction.findByIdAndDelete(req.body.auction._id);
    let auctions = await Auction.find();
    auctions = auctions.map((a) => filterObject(a, AuctionViewModelAdmin));
    return {status: true, data: auctions};
  },

  /**
   * Asynchronously adds an auction to the database with the given request body.
   *
   * @param {Object} req - The request object containing the auction data.
   * @param {Object} req.body - The body of the request.
   * @param {Object} req.body.auction - The auction object to be added.
   * @param {string} req.body.auction.adminId - The ID of the admin creating the auction.
   * @param {string} req.body.auction.password - The password for the auction.
   * @return {Promise<Object>} Returns a promise that resolves to an object with the status and added auction data.
   * The status is true and the data contains the added auction with the password field removed.
   * @throws {Error} Throws an error with the message 'Admin ID incorrect !' if the admin ID is incorrect.
   * @throws {Error} Throws an error with the specified ERRORCODE if the add fails.
   */
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
      auctionJson.allowRealtimeUpdates = false;
      auctionJson.password = await bcrypt.hash(
          decrypt.decrypt(auctionJson.password),
          5,
      );
      auctionJson.maxBudget = auctionJson.maxBudget ?
        auctionJson.maxBudget :
        1000;
      auctionJson.createdAt = new Date();

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
  /**
   * Updates an auction asynchronously.
   *
   * @param {Object} req - The request object containing the auction data.
   * @return {Promise<Object>} Returns a promise that resolves to an object with the status and updated auction data.
   */
  updateAuction: async (req) => {
    return await trywrapper(async () => {
      await Auction.findByIdAndUpdate(req.body.auction._id, req.body.auction);
      const auction = await Auction.findById(req.body.auction._id);
      return {status: true, data: auction};
    }, ERRORCODE);
  },
  /**
   * Deletes an auction.
   *
   * @param {Object} req - The request object.
   * @param {string} req.body.deleteId - The delete ID.
   * @param {Object} req.body.auction - The auction object.
   * @param {string} req.body.auction._id - The ID of the auction to be deleted.
   * @return {Promise<Object>} A promise that resolves to an object with the status.
   * @throws {Error} If the delete admin ID is incorrect.
   */
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
