"use strict";

const path = require('path');
const dbManager = require('../dbmanager.js');
const User = require("../user.js");

async function check(req, res, next) {
    let room = await dbManager.findRoom(req.params.id);
    let userID = req.cookies.user;

    //room is full or does not exists
    if (room == null || (room.connected > 1 && userID != room.uIDs[0] && userID != room.uIDs[1])) {
        res.redirect('/');
        return;
    }

    if (userID == null || (userID != room.uIDs[0] && userID != room.uIDs[1]))
        res.locals.playerNumber = null;
    else
        res.locals.playerNumber = userID == room.uIDs[0] ? 0 : 1;    
    
    res.locals.room = room;

    next();
}

async function get(req, res) {
    //new player (link)
    if (res.locals.playerNumber == null) {
        res.sendFile(path.join(__dirname, "../../views/initform.html"));
        return;
    }

    res.render("board");
}

async function post(req, res) {
    //new player sent his nick
    if (res.locals.playerNumber == null) {
        if (req.body == null || req.body.nick == null || req.body.nick.trim() == "") {
            res.status(400).send('Nie wpisano nicku');
            return;
        }
        res.locals.playerNumber = 1;
        let user = new User(req.body.nick);
        res.cookie('user', user.id);
        user.join(req.params.id);
        res.locals.room = await dbManager.findRoom(req.params.id);
        res.render("board");
        return;
    }

    if (req.body.position == null || isNaN(req.body.position) || req.body.position < 0 || req.body.position > 8) {
        res.status(400).send("Invalid value");
        return;
    }
    let position = parseInt(req.body.position);

    if (res.locals.playerNumber == res.locals.room.turn && res.locals.room.board[position] == null && res.locals.room.winner == null) {
        res.locals.room = await dbManager.updateRoom(req.params.id, res.locals.playerNumber, position);
    }
    res.render("board");
}

module.exports = {
    check,
    get,
    post
}