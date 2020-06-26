"use strict";

const dbManager = require('../dbmanager.js');

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

module.exports = {
    get
}