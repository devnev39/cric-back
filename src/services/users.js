const tempUser = require('../models/tempUser');
const {trywrapper} = require('../utils');
const crypto = require('crypto');
const ERRORCODE = 430;

module.exports = {
  getUsers: async (req) => {
    return await trywrapper(async () => {
      const users = await tempUser.find();
      return {
        status: 200,
        data: users,
      };
    }, ERRORCODE);
  },

  addUser: async (req) => {
    return await trywrapper(async () => {
      req.body.tempUser.pat = crypto.randomBytes(48).toString('hex');
      req.body.tempUser.enabled = true;
      const user = new tempUser(req.body.tempUser);
      await user.save();
      const users = await tempUser.find();
      return {
        status: 200,
        data: users,
      };
    }, ERRORCODE);
  },

  updateUser: async (req) => {
    return await trywrapper(async () => {
      await tempUser.findByIdAndUpdate(
          req.body.tempUser._id,
          req.body.tempUser,
      );
      const users = await tempUser.find();
      return {status: 200, data: users};
    }, ERRORCODE);
  },

  removeUser: async (req) => {
    return await trywrapper(async () => {
      await tempUser.findByIdAndDelete(req.params.user_id);
      const users = await tempUser.find();
      return {status: 200, data: users};
    }, ERRORCODE);
  },
};
