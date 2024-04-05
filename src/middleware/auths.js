module.exports = {
  adminAuth: (req, res, next) => {
    if (!req.session.isAdminAuthenticated) {
      res.json({
        status: false,
        erroCode: 505,
        data: 'Incorrect credentials',
        POST: '/auth/admin',
      });
    } else {
      next();
    }
  },
  auctionAuth: (req, res, next) => {
    if (
      !req.session.isAuctionAuthenticated &&
      process.env.APISECURE == 'TRUE'
    ) {
      res.json({
        status: false,
        errorCode: 510,
        data: 'Incorrect credentials',
        POST: `/auth/auction/${req.params.auctionId}`,
      });
    } else {
      next();
    }
  },
};
