require("dotenv").config();
const { decrypt } = require(".")
const bcrypt = require("bcrypt");

module.exports = { 
    newAuctionAdminAuth: async (auctionJson) => {
        const key = decrypt.decrypt(auctionJson.Adminid);
        const result = await bcrypt.compare(key, process.env.ADMINID)
        return result;
    },
    deleteAuctionAuth: async (deleteId) => {
        const key = decrypt.decrypt(deleteId);
        const result = await bcrypt.compare(key, process.env.DELETEID);
        return result;
    } 
}