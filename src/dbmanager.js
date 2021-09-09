"use strict";

import MongoClient from 'mongodb';
import checkWinner from './checkwinner.js';

let collection;
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }).then(client => collection = client.db().collection('rooms'));

/**
 * Create entry for new room in database.
 * @param {String} userNick - user nickname
 * @param {String} userID - id of user
 * @returns number of room
 */
async function createRoom(userNick, userID) {
    let count = await collection.find({}).count();
    let roomToCreate = count + 1;   //assign room number (after already running)
    await collection.insertOne({ _id: roomToCreate, connected: 1, turn: 2, nicks: [userNick], uIDs: [userID], board: [] });
    return roomToCreate;
}

/**
 * Add new player to the given room in database.
 * @param {int} roomID - number of room
 * @param {String} userNick - user nickname
 * @param {String} userID - id of user
 */
async function joinRoom(roomID, userNick, userID) {
    let turn = Math.floor(Math.random() * 2);   //random player starts
    await collection.updateOne({_id: parseInt(roomID)}, {$set: {connected: 2, turn: turn}, $push: {nicks: userNick, uIDs: userID}});
}

/**
 * Pull from database data about specified room.
 * @param {int} roomID - number of room
 * @returns object containing room properties
 */
function findRoom(roomID) {
    return collection.findOne({_id: parseInt(roomID)});
}

/**
 * Pull from database data about room with specified player.
 * @param {String} uID - id of player
 * @returns object containing room properties
 */
function findRoomByUserID(uID) {
    return collection.findOne({uIDs: uID});
}

/**
 * Update room when player makes move.
 * @param {int} roomID - number of room
 * @param {int} playerNumber - number of player in room
 * @param {int} position - position of the field player clicked
 * @returns updated object containing room properties
 */
async function updateRoom(roomID, playerNumber, position) {
    let room = await collection.findOne({_id: parseInt(roomID)});
    room.board[position] = playerNumber;
    room.turn = playerNumber == 0 ? 1 : 0;
    if (checkWinner(room)) {
        room.winner = playerNumber;
    } else if (room.board.length == 9) {
        room.draw = true;
        for (let i = 0; i < 9; i++) {
            if (room.board[i] == null) {
                room.draw = false;
                break;
            }
        }
    }
    await collection.replaceOne({_id: parseInt(roomID)}, room);
    return room;
}

export {
    createRoom,
    findRoom,
    findRoomByUserID,
    updateRoom,
    joinRoom
}