"use strict";

import * as dbManager from '../dbmanager.js';
import User from '../user.js';

/**
 * GET request to /api
 */
async function get(req, res) {
    let userID = req.cookies.user;
    try {
        let response = await dbManager.findRoomByUserID(userID);
        response.playerNumber = userID == response.uIDs[0] ? 0 : 1; 
        delete response.uIDs;   //no need to send this
        res.json(response);
    } catch (e) {
        res.status(404).send("Game not found");
    }   
}

/**
 * User check if he can join room
 */
async function check(req, res, next) {
    let room = await dbManager.findRoom(req.params.id);
    let userID = req.cookies.user;

    res.locals.response = {};

    //room is full or does not exists
    if (room == null || (room.connected > 1 && userID != room.uIDs[0] && userID != room.uIDs[1])) {
        res.locals.response.canJoin = false;
        return next();
    }
    res.locals.response.canJoin = true;

    if (userID != null && (userID == room.uIDs[0] || userID == room.uIDs[1]))
        res.locals.response.canPlay = true;
    next();
}

/**
 * Send response to client. Used combined with check() which works as middleware
 */
async function send(req, res) {
    res.json(res.locals.response);
}

async function create(req, res) {
    if (req.body == null || req.body.nick == null || req.body.nick.trim() == "") {
        res.status(400).send("Nie wpisano nicku");
        return;
    }
    let user = new User(req.body.nick);
    res.cookie('user', user.id);
    let roomID = await user.assign();
    res.json({ canPlay: true, roomID: roomID });
}

/**
 * Function called when client send POST request
 */
async function joinRoom(req, res) {
    if (!res.locals.response.canJoin) {
        res.locals.response.canPlay = false;
        res.json(res.locals.response);
        return;
    }

    if (res.locals.response.canPlay) {
        res.json(res.locals.response);
        return;
    }

    if (req.body == null || req.body.nick == null || req.body.nick.trim() == "") {
        res.locals.response.canPlay = false;
    } else {
        res.locals.response.canPlay = true;
        let user = new User(req.body.nick);
        res.cookie('user', user.id);
        user.join(req.params.id);
    }
    res.json(res.locals.response);
}

export {
    get,
    check,
    send,
    create,
    joinRoom
}