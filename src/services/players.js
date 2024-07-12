const DocumentNotFoundError = require('../errors/documentNotFound');
const auctionPlayers = require('../models/auctionPlayers');
const Player = require('../models/player');
const utils = require('../utils/index');
const {playerValidatorWimodel} = require('../utils/validatemodel');
const ERRORCODE = 410;

module.exports = {
  /**
   * Retrieves players for a specific auction based on the auction ID.
   *
   * @param {Object} req - The request object containing the auction ID.
   * @return {Object} An object with status true and the data of auction players.
   */
  getPlayers: async (req) => {
    return await utils.trywrapper(async () => {
      let auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new DocumentNotFoundError();
      return {status: true, data: auctionPlayersObject};
    }, ERRORCODE);
  },
  /**
   * Uploads players to the auction.
   *
   * @param {Object} req - The request object.
   * @return {Promise<Object>} - A promise that resolves to an object with the status and data of the auction players.
   */
  uploadPlayers: async (req) => {
    return await utils.trywrapper(async () => {
      // const a = await auction.findById(req.params.auction_id);
      const auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      // let srno = getSrno(a);
      for (const p of req.body.players) {
        // p.SRNO = ++srno;
        if ((valid = playerValidatorWimodel(p, ['imgUrl'])) != true) {
          throw new Error(valid);
        }
        const player = new Player(p);
        auctionPlayersObject.customPlayers.push(player);
      }
      await auctionPlayersObject.save();
      return {status: true, data: auctionPlayersObject};
    }, ERRORCODE);
  },
  /**
   * Adds players to the auction.
   *
   * @param {Object} req - The request object containing the auction ID and player(s) to be added.
   * @param {string} req.params.auctionId - The ID of the auction.
   * @param {Array<Object>|Object} req.body.players - The player(s) to be added.
   * @param {Object} req.body.player - The player to be added (alternative to req.body.players).
   * @throws {Error} If the player(s) object is not found.
   * @return {Promise<Object>} - A promise that resolves to an object with the status and data of the added players.
   */
  addPlayers: async (req) => {
    return await utils.trywrapper(async () => {
      let auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new DocumentNotFoundError();

      const players = [];
      if (req.body.players) {
        for (const p of req.body.players) {
          p.isAdded = true;
          p.includeInAuction = true;
          p.isEdited = false;
          const player = new Player(p);
          if (auctionPlayersObject.useCustom) {
            auctionPlayersObject.customPlayers.push(player);
          } else {
            auctionPlayersObject.players.push(player);
          }
          players.push(player);
        }
      } else if (req.body.player) {
        req.body.player.isAdded = true;
        req.body.player.includeInAuction = true;
        req.body.player.isEdited = false;
        const player = new Player(req.body.player);
        if (auctionPlayersObject.useCustom) {
          auctionPlayersObject.customPlayers.push(player);
        } else {
          auctionPlayersObject.players.push(player);
        }
        players.push(req.body.player);
      } else {
        throw new Error('player(s) object not found !');
      }
      await auctionPlayersObject.save();
      return {status: true, data: players};
    }, ERRORCODE);
  },

  /**
   * Deletes a player from the auction players based on the provided request.
   *
   * @param {Object} req - The request object containing the auction ID and player to be deleted.
   * @return {Promise<Object>} - A promise that resolves to an object with the status of the deletion.
   */
  deletePlayer: async (req) => {
    return await utils.trywrapper(async () => {
      const auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new DocumentNotFoundError();
      // const a = await auction.findById(req.params.auction_id);
      if (auctionPlayersObject.useCustom) {
        auctionPlayersObject.customPlayers.pull({_id: req.body.player._id});
      } else {
        auctionPlayersObject.players.pull({_id: req.body.player._id});
      }
      await auctionPlayersObject.save();
      return {status: true};
    }, ERRORCODE);
  },

  /**
   * Updates a player in the auction players based on the provided request.
   *
   * @param {Object} req - The request object containing the auction ID and player to be updated.
   * @param {Object} req.body.player - The player object to be updated.
   * @param {Object} req.body.datasetProperties - The dataset properties to be updated.
   * @return {Promise<Object>} - A promise that resolves to an object with the status and data of the updated player.
   * @throws {DocumentNotFoundError} - If the auction players object is not found.
   */
  updatePlayer: async (req) => {
    return await utils.trywrapper(async () => {
      // req.body.player
      // req.body.datasetProperties

      let auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new DocumentNotFoundError();

      let res;

      if (req.body.player) {
        // Update the player
        if (auctionPlayersObject.useCustom) {
          res = auctionPlayersObject.customPlayers.filter((p) => {
            return p._id == req.body.player._id;
          });
        } else {
          res = auctionPlayersObject.players.filter((p) => {
            return p._id == req.body.player._id;
          });
        }

        if (res.length) {
          res = res[0];
        } else throw new DocumentNotFoundError();

        Object.keys(req.body.player).forEach((key) => {
          res[key] = req.body.player[key];
        });
        await auctionPlayersObject.save();
      }

      if (req.body.datasetProperties) {
        // Update the dataset propeties
        Object.keys(req.body.datasetProperties).forEach((key) => {
          auctionPlayersObject[key] = req.body.datasetProperties[key];
        });
        await auctionPlayersObject.save();
      }
      return {status: true, data: res};
    }, ERRORCODE);
  },
  /**
   * Moves a player from one source to a destination in the auction players.
   *
   * @param {Object} req - The request object containing the auction ID, source, destination, and player to be moved.
   * @param {string} req.params.auctionId - The ID of the auction.
   * @param {string} req.body.source - The source where the player is currently located.
   * @param {string} req.body.destination - The destination where the player will be moved to.
   * @param {Object} req.body.player - The player to be moved.
   * @param {string} req.body.player._id - The ID of the player.
   * @throws {DocumentNotFoundError} - If the auction players object or the player is not found.
   * @return {Promise<Object>} - A promise that resolves to an object with the status of the move.
   */
  movePlayer: async (req) => {
    return await utils.trywrapper(async () => {
      // req.body.source
      // req.body.destination
      // req.body.player

      let auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new DocumentNotFoundError();

      let player = auctionPlayersObject[req.body.source].filter(
          (p) => p._id == req.body.player._id,
      );
      if (player.length) {
        player = player[0];
      } else throw new DocumentNotFoundError();

      auctionPlayersObject[req.body.source].pull({_id: req.body.player._id});
      auctionPlayersObject[req.body.destination].push(player);

      await auctionPlayersObject.save();
      return {status: true};
    }, ERRORCODE);
  },
};
