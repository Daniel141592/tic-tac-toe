"use strict";

const path = require('path');
const dbManager = require('./dbmanager.js');
const User = require("./user.js");

async function check(req, res, next) {
    let room = await dbManager.findRoom(req.params.id);
    let userID = req.cookies.user;

    //room is full or does not exists
    if (room == null || (room.connected > 1 && userID != room.uIDs[0] && userID != room.uIDs[1])) {
        res.redirect("/");
        return;
    }

    if (userID == null || (userID != room.uIDs[0] && userID != room.uIDs[1]))
        res.playerNumber = null;
    else
        res.playerNumber = userID == room.uIDs[0] ? 0 : 1;    
    
    res.room = room;
    res.userID = userID;

    next();
}

async function get(req, res) {
    //new player (link)
    if (res.playerNumber == null) {
        res.sendFile(path.join(__dirname, "../views/initform.html"));
        return;
    }

    res.render("board", {board: res.room, playerNumber: res.playerNumber});
}

async function post(req, res) {
    //new player sent his nick
    if (res.playerNumber == null) {
        if (req.body == null || req.body.nick.trim() == "") {
            res.send('brak nicku lub pusty');
            return;
        }
        let user = new User(req.body.nick);
        res.cookie('user', user.id);
        user.join(req.params.id);
        res.room = await dbManager.findRoom(req.params.id);
        res.render("board", {board: res.room, playerNumber: 1});
        return;
    }

    if (isNaN(req.body.b) || req.body.b < 0 || req.body.b > 8) {
        res.status(500).send("Invalid value");
        return;
    }
    let position = parseInt(req.body.b);

    if (res.playerNumber == res.room.turn && res.room.b[position] == null && res.room.winner == null) {
        res.room = await dbManager.updateRoom(req.params.id, res.playerNumber, position);
    }
    res.render("board", {board: res.room, playerNumber: res.playerNumber});
}

module.exports = {
    check,
    get,
    post
}