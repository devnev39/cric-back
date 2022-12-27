const Auction = require("../models/auction");
const decrypt = require("../utils/decrypt");
const trywrapper = require("../utils/trywrapper");
const bcrypt = require("bcrypt");
const ERRORCODE = 400;
module.exports = {
    getAuction : async () => {
        return await trywrapper(async () => {
            let result = await Auction.find();
            result.forEach(ele => {ele.Password = undefined;ele.Teams = undefined});
            return {status : 200, data:result};
        });
    },
    addAuction : async (auctionJson) => {
        return await trywrapper(async () => {
            if(!auctionJson.No) auctionJson.No = await Auction.countDocuments()+1;
            auctionJson.Status = "red";
            auctionJson.Password = await bcrypt.hash(decrypt.decrypt(auctionJson.Password),5);
            const a = new Auction(auctionJson);
            await a.save();
            return {status : 200};
        },ERRORCODE);
    },
    updateAuction : async (auctionJson) => {
        return await trywrapper(async () => {
            await Auction.findOneAndReplace({No : auctionJson.No},auctionJson);
            return {status : 200};
        },ERRORCODE);
    },
    deleteAuction : async (auctionJson) => {
        return await trywrapper(async () => {
            await Auction.deleteOne({No : auctionJson.No});
            return {status : 200};
        },ERRORCODE);
    }
};