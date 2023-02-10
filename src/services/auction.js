const Auction = require("../models/auction");
const bcrypt = require("bcrypt");
const player = require("../models/player");
const { filterObject, trywrapper, decrypt } = require("../utils/index");
const { publicAuctionViewModel } = require("../models/wimodels");
const ERRORCODE = 400;
module.exports = {
    getAuction : async () => {
        return await trywrapper(async () => {
            let result = await Auction.find();
            result = result.map(a => filterObject(a,publicAuctionViewModel));
            return {status : 200, data:result};
        });
    },
    addAuction : async (auctionJson) => {
        return await trywrapper(async () => {
            if(!auctionJson.No) auctionJson.No = await Auction.countDocuments()+1;
            auctionJson.Status = "red";
            auctionJson.poolingMethod = "Composite";
            auctionJson.Password = await bcrypt.hash(decrypt.decrypt(auctionJson.Password),5);
            const a = new Auction(auctionJson);
            a.dPlayers = await player.find();
            await a.save();
            return {status : 200};
        },ERRORCODE);
    },
    updateAuction : async (auctionJson) => {
        return await trywrapper(async () => {
            await Auction.findByIdAndUpdate(auctionJson._id,auctionJson);
            return {status : 200};
        },ERRORCODE);
    },
    deleteAuction : async (auctionJson) => {
        return await trywrapper(async () => {
            await Auction.findByIdAndDelete(auctionJson._id);
            await Auction.updateMany({No : {$gt : auctionJson.No}},{$inc : {No : -1}});
            return {status : 200};
        },ERRORCODE);
    }
};