"use strict";

import WebSocket from 'ws';
import cookie from 'cookie';
import * as dbManager from './dbmanager.js';

let sockets = [];

/**
 * Start listening on server socket and handle moves in game.
 */
function init() {
    const PORT = process.env.WEBSOCKET_PORT || 3300;
    const wss = new WebSocket.Server({ port: PORT });
    
    wss.on('connection', async (ws, request) => {
        let userID = cookie.parse(request.headers.cookie).user;
        let room = await dbManager.findRoomByUserID(userID);
        if (sockets[room._id] == undefined)
            sockets[room._id] = [];
        sockets[room._id][userID] = ws;
    
        ws.on('message', async message => {
            room = await dbManager.findRoomByUserID(userID);
            if (room == null || userID == null || (room.connected > 1 && userID != room.uIDs[0] && userID != room.uIDs[1])) {
                ws.send("REDIRECT");
                return;
            }
    
            let playerNumber = userID == room.uIDs[0] ? 0 : 1;
    
            if (message == null || isNaN(message) || message < 0 || message > 8) {
                ws.send("Invalid value");
                return;
            }
            let position = parseInt(message);
        
            if (playerNumber == room.turn && room.board[position] == null && room.winner == null) {
                room = await dbManager.updateRoom(room._id, playerNumber, position);
            }
            send(room);
        });
    });
}

/**
 * Send data about specified room to all players in that room.
 * @param {*} room - object describing room to work with
 */
function send(room) {
    if (sockets[room._id] == undefined)
        return;
    
    //send board to all players
    for (const userID in sockets[room._id]) {
        let response = JSON.parse(JSON.stringify(room));    //copy object
        response.playerNumber = userID == room.uIDs[0] ? 0 : 1;
        delete response.uIDs;
        sockets[room._id][userID].send(JSON.stringify(response));
    }
}

export {
    send, init
};