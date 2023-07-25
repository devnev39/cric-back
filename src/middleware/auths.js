module.exports = {
    adminAuth : (req,res,next) => {
        if(!req.session.isAdminAuthenticated){
            res.json({status : 505,data : "Incorrect credentials",POST : "/auth/admin"});
        }else next();
    },
    auctionAuth : (req,res,next) => {
        if(!req.session.isAuctionAuthenticated){
            res.json({status : 510,data : "Incorrect credentials",POST : `/auth/auction/${req.params.auction_id}`});
        }else next();
    }
}