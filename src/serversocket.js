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
    sockets[room._id].push(ws);
    console.log("In room "+room._id+" there is "+(sockets[room._id].length)+" sockets");

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
        room.playerNumber = userID == room.uIDs[0] ? 0 : 1; 
        delete room.uIDs;   //no need to send this
        
        //send board to all players
        for (const i in sockets[room._id]) {
            room.yourTurn = sockets[room._id][i] != ws;
            sockets[room._id][i].send(JSON.stringify(room));
        }
	});
});