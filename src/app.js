require("dotenv").config();
const express = require("express");
const session = require("express-session");
const adminRouter = require('./routers/adminRouter');
const generalRouter = require('./routers/generalRouter');
const auctionRouter = require("./routers/auctionRouter");
const bodyParser = require("body-parser");
const cors = require("cors");
const production = process.env.NODE_ENV === 'production';
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection",(socket) => {
    console.log("Connected to socket");
})
io.on("disconnection", (socket) => {
    console.log("Disconnection from : ",socket)
})

app.use(session({
    secret : process.env.SESS_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : production
    }
}));

app.use(cors({
    origin : ["http://localhost:3001","https://cric-front.onrender.com"],
    credentials : true
}))

app.use((err,req,res,next) => {
    if(err){ res.json({status : 500,data : err}); }
    else next();
});

app.use((req,res,next) => {
    req.io = io;
    next();
})

app.use(bodyParser.json());

app.use([auctionRouter,generalRouter,adminRouter]);

app.route("/*")
.get((req,res) => {res.json({data : "Not found !", status : 404})});

module.exports = server;