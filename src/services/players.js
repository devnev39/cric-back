const auction = require('../models/auction');
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
      const a = await auction.findById(req.params.auction_id);
      const resp = {};
      if (a.poolingMethod == 'Composite') {
        resp.main = a.dPlayers;
        resp.add = a.add;
        resp.rmv = a.rmv;
        resp.sup = a.sup;
      } else if (a.poolingMethod == 'Custom') {
        resp.main = a.cPlayers;
        resp.add = a.add;
        resp.rmv = a.rmv;
        resp.sup = a.sup;
      }
      return {status: 200, data: resp};
    }, ERRORCODE);
  },
  uploadPlayers: async (req) => {
    return await utils.trywrapper(async () => {
      const a = await auction.findById(req.params.auction_id);
      // let srno = getSrno(a);
      for (const p of req.body.players) {
        // p.SRNO = ++srno;
        if ((valid = playerValidatorWimodel(p, ['imgUrl'])) != true) {
          throw new Error(valid);
        }
        const player = new Player(p);
        if (a.poolingMethod == 'Custom') {
          a.cPlayers.push(player);
        } else {
          throw new Error(
              'Cannot upload players in Composite poolingMethod (Default players dataset) !',
          );
        }
      }
      await a.save();
      return {status: 200};
    }, ERRORCODE);
  },
  addPlayers: async (req) => {
    return await utils.trywrapper(async () => {
      const a = await auction.findById(req.params.auction_id);
      // let srno = getSrno(a); // TODO: solve the srno issue
      let player = null;
      if (req.body.players) {
        for (const p of req.body.players) {
          // p.SRNO = ++srno;
          const player = new Player(p);
          a.add.push(player);
        }
      } else if (req.body.player) {
        // req.body.player.SRNO = ++srno;
        player = new Player(req.body.player);
        a.add.push(player);
      } else {
        throw new Error('player(s) object not found !');
      }
      await a.save();
      return {status: 200, data: player, mergeTo: 'Add'};
    }, ERRORCODE);
  },
  deletePlayer: async (req) => {
    return await utils.trywrapper(async () => {
      const a = await auction.findById(req.params.auction_id);
      if (!req.body.src && !req.body.dest) {
        a.rmv.pull({_id: req.body.player._id});
      } else {
        throw new Error('DELETE method conditions not satisfied !');
      }
      await a.save();
      return {status: 200};
    }, ERRORCODE);
  },
  updatePlayer: async (req) => {
    return await utils.trywrapper(async () => {
      req.body.player.edited = true;
      const a = await auction.findById(req.params.auction_id);
      let player = null;
      let dataset = a.poolingMethod == 'Composite' ? 'dPlayers' : 'cPlayers';
      for (const p of a.dPlayers) {
        if (p._id == req.body.player._id) {
          player = p;
        }
      }
      if (!player) {
        for (const p of a.add) {
          if (p._id == req.body.player._id) {
            player = p;
            dataset = 'add';
          }
        }
      }
      console.log(player, dataset);
      a[dataset].pull({_id: req.body.player._id});
      a[dataset].push(req.body.player);
      // a[dataset].sort((a, b) => a.SRNO - b.SRNO);
      await a.save();
      const resp = await auction.findById(req.params.auction_id);
      return {status: 200, data: resp};
    }, ERRORCODE);
  },
  poolPlayers: async (req) => {
    return await utils.trywrapper(async () => {}, ERRORCODE);
  },
  movePlayer: async (req) => {
    return await utils.trywrapper(async () => {
      const a = await auction.findById(req.params.auction_id);
      let player = null;
      let {src, dest} = req.body;
      if (req.body.src == 'mPlayers' || req.body.dest == 'mPlayers') {
        if (a.poolingMethod == 'Composite' && req.body.src == 'mPlayers') {
          src = 'dPlayers';
        }
        if (a.poolingMethod == 'Composite' && req.body.dest == 'mPlayers') {
          dest = 'dPlayers';
        }
        if (a.poolingMethod == 'Custom' && req.body.src == 'mPlayers') {
          src = 'cPlayers';
        }
        if (a.poolingMethod == 'Custom' && req.body.dest == 'mPlayers') {
          dest = 'cPlayers';
        }
      }
      for (const p of a[src]) {
        if (p._id == req.body.player._id) {
          player = p;
        }
      }
      a[src].pull({_id: req.body.player._id});
      a[dest].push(player);
      // a[dest].sort((a, b) => a.SRNO - b.SRNO);
      await a.save();
      return {status: 200};
    }, ERRORCODE);
  },
};
