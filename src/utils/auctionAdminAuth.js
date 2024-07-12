require('dotenv').config();
const {decrypt} = require('.');
const bcrypt = require('bcrypt');

module.exports = {
  /**
   * Asynchronously authenticates a new auction admin.
   *
   * @param {type} adminId - The admin ID for authentication
   * @return {type} The authentication result
   */
  newAuctionAdminAuth: async (adminId) => {
    const key = decrypt.decrypt(adminId);
    const result = await bcrypt.compare(key, process.env.ADMINID);
    return result;
  },
  /**
   * Asynchronously authenticates a deletion of an auction.
   *
   * @param {string} deleteId - The encrypted ID for deletion authentication
   * @return {Promise<boolean>} The authentication result
   */
  deleteAuctionAuth: async (deleteId) => {
    const key = decrypt.decrypt(deleteId);
    const result = await bcrypt.compare(key, process.env.DELETEID);
    return result;
  },
};
