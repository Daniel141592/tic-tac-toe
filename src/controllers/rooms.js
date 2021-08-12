"use strict";

import path from 'path';
import * as dbManager from '../dbmanager.js';
import User from '../user.js';
import * as serversocket from '../serversocket.js';

const __dirname = path.resolve();

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
        res.sendFile(path.join(__dirname, "views/initform.html"));
        return;
    }

    res.render("board");
}

async function post(req, res) {
    if (res.locals.playerNumber != null)
        return;
    //new player sent his nick
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
    serversocket.send(res.locals.room);     //send information to other players
}

export {
    check,
    get,
    post
}