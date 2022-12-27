module.exports = (req,res,next) => {
        if(req.session) if(req.session.isAuctionAuthenticated) if(req.session.authenticatedAuctionId) {res.json({status : 601,data : req.session.authenticatedAuctionId}); return;}
        next();
}