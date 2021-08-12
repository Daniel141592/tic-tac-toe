"use strict";

import WebSocket from 'ws';
import cookie from 'cookie';
import * as dbManager from './dbmanager.js';

const wss = new WebSocket.Server({ port: 3300 });
let sockets = [];

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

function send(room) {
    if (sockets[room._id] == undefined)
        return;
    
    //send board to all players
    for (const userID in sockets[room._id]) {
        let response = JSON.parse(JSON.stringify(room));
        response.playerNumber = userID == room.uIDs[0] ? 0 : 1;
        delete response.uIDs;
        sockets[room._id][userID].send(JSON.stringify(response));
    }
}

export {
    send
};