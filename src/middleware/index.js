module.exports = middlewares = {
    auth : require("./auths"),
    upload : require("./uploadFile"),
    teamFilter : require("./teamFilter"),
    auctionFilter : require("./auctionFilter"),
    queryFilter : require("./queryFilter"),
    authenticatedAuctionFilter : require("./authenticatedAuctionFilter")
};