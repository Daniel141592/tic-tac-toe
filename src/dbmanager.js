"use strict";

const {MongoClient} = require('mongodb');
const checkWinner = require('./checkwinner.js');

let collection;
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }).then(client => collection = client.db().collection('rooms'));

async function createRoom(userNick, userID) {
    let count = await collection.find({}).count();
    let roomToCreate = count + 1;   //assign room number (after already running)
    await collection.insertOne({ _id: roomToCreate, connected: 1, turn: 2, nicks: [userNick], uIDs: [userID], b: [] });
    return roomToCreate;
}

async function joinRoom(roomID, userNick, userID) {
    let turn = Math.floor(Math.random() * 2);   //random player starts
    await collection.updateOne({_id: parseInt(roomID)}, {$set: {connected: 2, turn: turn}, $push: {nicks: userNick, uIDs: userID}});
}

function findRoom(roomID) {
    return collection.findOne({_id: parseInt(roomID)});
}

function findRoomByUserID(uID) {
    return collection.findOne({uIDs: uID});
}

async function updateRoom(roomID, playerNumber, position) {
    let sign = playerNumber == 0 ? "×" : "⃝";    //first player (room creator) is always "×"
    let room = await collection.findOne({_id: parseInt(roomID)});
    room.b[position] = sign;
    room.turn = playerNumber == 0 ? 1 : 0;
    if (checkWinner(room)) {
        room.winner = playerNumber;
    } else if (room.b.length == 9) {
        room.draw = true;
        for (let i = 0; i < 9; i++) {
            if (room.b[i] == null) {
                room.draw = false;
                break;
            }
        }
    }
    await collection.replaceOne({_id: parseInt(roomID)}, room);
    return room;
}

module.exports = {
    createRoom,
    findRoom,
    findRoomByUserID,
    updateRoom,
    joinRoom
}