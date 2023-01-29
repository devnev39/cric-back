const auction = require("../models/auction");
const { trywrapper } = require("../utils");

module.exports = async (req,res,next) => {
        const resp = await trywrapper(async () => {
                if(req.session.isAuctionAuthenticated && req.session.authenticatedAuctionId) {
                        let a = await auction.findById(req.session.authenticatedAuctionId);
                        a.Password = undefined;
                        return {status : 601,data : a};
                } else return undefined;
        },605);
        if(resp){res.json(resp);return;}
        next();
}