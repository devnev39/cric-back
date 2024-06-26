require('dotenv').config();
const express = require('express');

const routes = require('../routes/adminRouter/index');
const middlewares = require('../middleware/index');
const router = express.Router();

router
    .route('/users')
    .get(middlewares.auth.adminAuth, routes.user.get)
    .post(middlewares.auth.adminAuth, routes.user.post);

router
    .route('/admin/auctions')
    .get(middlewares.auth.adminAuth, routes.auction.get);

router
    .route('/admin/auctions/:auction_id')
    .put(middlewares.auth.adminAuth, routes.auction.put)
    .delete(middlewares.auth.adminAuth, routes.auction.delete);

router
    .route('/users/:userId')
    .put(middlewares.auth.adminAuth, routes.user.put)
    .delete(middlewares.auth.adminAuth, routes.user.delete);
// router.use(fileUpload());

// router.use(middlewares.auth.adminAuth);

// router.route("/players")
// .get(routes.players.get)
// .post(middlewares.upload,routes.players.post)
// .delete(routes.players.delete)
// .put(routes.players.put)

// router.route("/teams")
// .get(routes.teams.get)
// .post(middlewares.teamFilter,routes.teams.post)
// .delete(routes.teams.delete)
// .put(routes.teams.put)

module.exports = router;
