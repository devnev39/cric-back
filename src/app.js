require('dotenv').config();
const express = require('express');
const session = require('express-session');
const adminRouter = require('./routers/adminRouter');
const generalRouter = require('./routers/generalRouter');
const auctionRouter = require('./routers/auctionRouter');
const bodyParser = require('body-parser');
const cors = require('cors');
const production = process.env.NODE_ENV === 'production';
const app = express();
const server = require('http').createServer(app);

const origins = [
  'http://localhost:5173',
  'https://cric-front.onrender.com',
  'http://192.168.0.105:5173',
  'https://cric-front.ddnsking.com',
  'http://localhost:3000',
];

console.log('production : ', production);

app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: production ? 'none' : 'lax',
        httpOnly: true,
        secure: production,
        maxAge: 6 * 60 * 60 * 1000,
      },
    }),
);

app.enable('trust proxy');

app.use(
    cors({
      origin: origins,
      credentials: true,
    }),
);

app.use((err, req, res, next) => {
  if (err) {
    res.json({status: false, data: err});
  } else {
    next();
  }
});

app.use(bodyParser.json());

app.use([auctionRouter, generalRouter, adminRouter]);

app.route('/*').get((req, res) => {
  res.status(404).send({data: 'Not found !'});
});

module.exports = server;
