const { default: mongoose, mongo } = require("mongoose");
const _ = require("lodash");
const auction = require("../models/auction");
const { trywrapper } = require("../utils");
const Rule = require("../models/rule");
const ERRCODE = 801;

module.exports = {
    addRule : async (req) => {
        return await trywrapper(async () => {
            console.log(req.body);
            const a = await auction.findById(req.params.auction_id);
            if(!req.body.rule) throw new Error("Rule not found !");
            const rule = new Rule(req.body.rule);
            a.Rules.push(rule);
            await a.save();
            let b = JSON.parse(JSON.stringify(a));
            b.dPlayers = null;
            b.dPlayers = null;
            if(req.io) await req.io.emit(req.params.auction_id, b);
            return {status : 200, data : a};
        },ERRCODE);
    },

    deleteRule : async (req) => {
        return await trywrapper(async () => {
            const a = await auction.findById(req.params.auction_id);
            if(!req.body.rule) throw new Error("Rule not found !");
            a.Rules.pull({_id : req.body.rule._id});
            await a.save();
            b = JSON.parse(JSON.stringify(a));
            b.cPlayers = null;
            b.dPlayers = null;
            if(req.io) await req.io.emit(req.params.auction_id, b);
            return {status : 200, data : a};
        },ERRCODE);
    }
}