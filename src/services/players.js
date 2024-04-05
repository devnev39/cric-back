const DocumentNotFoundError = require('../errors/documentNotFound');
const auctionPlayers = require('../models/auctionPlayers');
const Player = require('../models/player');
const utils = require('../utils/index');
const {playerValidatorWimodel} = require('../utils/validatemodel');
const ERRORCODE = 410;

// TODO: evaluate use cases for srno field
// const getSrno = (a) => {
//   let srno = 0;
//   if (a.dPlayers.length && a.poolingMethod == 'Composite') {
//     srno = a.dPlayers.length + 1;
//   }
//   if (a.Add.length && a.poolingMethod == 'Composite') {
//     srno += a.Add.length + 1;
//   }
//   if (a.cPlayers.length && a.poolingMethod == 'Custom') {
//     srno = a.cPlayers.length + 1;
//   }
//   return srno;
// };

module.exports = {
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
  addPlayers: async (req) => {
    return await utils.trywrapper(async () => {
      let auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new DocumentNotFoundError();

      // let srno = getSrno(a); // TODO: solve the srno issue

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
  poolPlayers: async (req) => {
    return await utils.trywrapper(async () => {}, ERRORCODE);
  },
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
