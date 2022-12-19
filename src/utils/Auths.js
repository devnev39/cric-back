require("dotenv").config();
const auction = require("../models/auction")
const bcrypt = require("bcrypt");
const decrypt = require("./decrypt");
const trywrapper = require("./trywrapper");

module.exports = {
    auctionAuth : async (req,res) => {
        const response = await trywrapper(async ()=> {
            const a = await auction.find({No : +req.params.auction_id});
            if(a.length){
                const pass = decrypt.decrypt(req.body.password);
                let result = false;
                bcrypt.compare(pass,a[0].Password,(err,r) => {
                    if(err){throw err}
                    if(r) result = r;
                    if(req.session) req.session.isAuctionAuthenticated = r;
                });
                if(result) return {status : 200};
                else return {status : 510,data : "Incorrect credintials !"};
            }
        },510);
        res.json(response);
    },
    adminAuth : async (req,res) => {
        const response = await trywrapper(async () => {
            const pass = decrypt.decrypt(req.body.password);
            const result = await bcrypt.compare(pass,process.env.ADMIN);
            if(req.session){
                if(req.session.isAuctionAuthenticated) throw new Error("Cannot give admin access without loggin out auction !");
                else req.session.isAdminAuthenticated = result;
            }else{
                throw new Error("Cookie error at server !");
            }
            if(result) return {status : 200};
            else return {status : 505,data : "Incorrect credintials !"};
        },505);
        res.json(response);
    }
}