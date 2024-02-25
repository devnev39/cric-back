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
      const auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      // const a = await auction.findById(req.params.auction_id);
      // const resp = {};
      // if (a.poolingMethod == 'Composite') {
      //   resp.main = a.dPlayers;
      //   resp.add = a.add;
      //   resp.rmv = a.rmv;
      //   resp.sup = a.sup;
      // } else if (a.poolingMethod == 'Custom') {
      //   resp.main = a.cPlayers;
      //   resp.add = a.add;
      //   resp.rmv = a.rmv;
      //   resp.sup = a.sup;
      // }
      return {status: 200, data: auctionPlayersObject};
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
      return {status: 200, data: auctionPlayersObject};
    }, ERRORCODE);
  },
  addPlayers: async (req) => {
    return await utils.trywrapper(async () => {
      const auctionPlayerObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      // const a = await auction.findById(req.params.auctionId);
      // let srno = getSrno(a); // TODO: solve the srno issue
      const players = [];
      if (req.body.players) {
        for (const p of req.body.players) {
          // p.SRNO = ++srno;
          const player = new Player(p);
          auctionPlayerObject.add.push(player);
          players.push(player);
        }
      } else if (req.body.player) {
        // req.body.player.SRNO = ++srno;
        const player = new Player(req.body.player);
        auctionPlayerObject.add.push(player);
        players.push(player);
      } else {
        throw new Error('player(s) object not found !');
      }
      await auctionPlayerObject.save();
      return {status: 200, data: players, mergeTo: 'Add'};
    }, ERRORCODE);
  },
  deletePlayer: async (req) => {
    return await utils.trywrapper(async () => {
      const auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      // const a = await auction.findById(req.params.auction_id);
      auctionPlayersObject.rmv.pull({_id: req.body.player._id});
      await auctionPlayersObject.save();
      return {status: 200};
    }, ERRORCODE);
  },
  updatePlayer: async (req) => {
    return await utils.trywrapper(async () => {
      req.body.player.edited = true;
      let auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new Error('No auction players object found !');

      let res = auctionPlayersObject.defaultPlayers.filter((p) => {
        return p._id == req.body.player._id;
      });

      if (res.length) {
        res = res[0];
      } else throw new Error('No player found with this id !');

      Object.keys(req.body.player).forEach((key) => {
        res[key] = req.body.player[key];
      });
      await auctionPlayersObject.save();
      return {status: 200, data: res};
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

      const auctionPlayersObject = await auctionPlayers.find({
        auctionId: req.params.auctionId,
      });
      if (auctionPlayersObject.length) {
        auctionPlayersObject = auctionPlayersObject[0];
      } else throw new Error('No auction players object found !');

      const player = auctionPlayersObject[req.body.source].filter(
          (p) => p._id == req.body.player._id,
      );
      if (player.length) {
        player = player[0];
      } else throw new Error('No player found with this id !');

      auctionPlayersObject[req.body.source].pull({_id: req.body.player._id});
      auctionPlayersObject[req.body.destination].push(player);

      await auctionPlayers.save();
      return {status: 200};
    }, ERRORCODE);
  },
};
