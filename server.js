require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./src/app");

let MONGO_URI = process.env.MONGO_URI
if(process.env.MONGO == 'LOCAL') MONGO_URI = "mongodb://127.0.0.1:27017/cric-mvc"

try {
    mongoose.connect(MONGO_URI);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT,() => {console.log(`Sever started on ${PORT}`)});
} catch (error) {
    console.log(error);
}