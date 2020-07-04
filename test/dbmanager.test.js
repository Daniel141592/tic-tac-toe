"use strict";

const dbManager = require('../src/dbmanager.js');
const checkWinner = require('../src/checkwinner.js');
const COUNT = 1;

let mockCollection = {
    insertOne: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    replaceOne: jest.fn(),
    count: jest.fn(() => COUNT)
};

jest.mock('../src/checkwinner.js');

jest.mock('mongodb', () => {
    return {
        MongoClient: {
            connect: jest.fn(() => {
                return Promise.resolve({
                    db() {
                        return {
                            collection() {
                                return mockCollection;
                            }
                        }
                    }
                });
            })
        }
    }
});

describe('dbmanager', () => {
    let roomID = "2";
    let userNick = "test123";
    let userID = "_abcdefghi";

    test('createRoom() should call collection.insertOne()', async () => {
        mockCollection.find.mockImplementationOnce(() => mockCollection);
        await dbManager.createRoom(userNick, userID);
        let obj = { _id: COUNT+1, connected: 1, turn: 2, nicks: [userNick], uIDs: [userID], board: [] };
        expect(mockCollection.insertOne).toHaveBeenLastCalledWith(obj);
    });

    test('joinRoom() should call collection.updateOne()', async () => {
        await dbManager.joinRoom(roomID, userNick, userID);
        expect(mockCollection.updateOne).toHaveBeenCalled();
    });

    test('findRoom() should call collection.findOne() with parseInt(roomID)', async () => {
        await dbManager.findRoom(roomID);
        expect(mockCollection.findOne).toHaveBeenLastCalledWith({_id: parseInt(roomID)});
    });

    test('findRoomByUserID() should call collection.findOne() with userID', async () => {
        await dbManager.findRoomByUserID(userID);
        expect(mockCollection.findOne).toHaveBeenLastCalledWith({uIDs: userID});
    });

    test('updateRoom() should update room.b[position]', async () => {
        let playerNumber = 0;
        let room = { board: [1, null] };
        let expected = { board: [1, 0], turn: 1 };
        let position = 1;
        mockCollection.findOne.mockImplementationOnce(() => room);
        checkWinner.mockImplementationOnce(() => false);
        room = await dbManager.updateRoom(roomID, playerNumber, position);
        expect(room).toEqual(expected);
    });

    test('when checkWinner() returns true updateRoom() should set room.winner', async () => {
        let playerNumber = 0;
        let room = { board: [1, null] };
        let expected = { board: [1, 0], turn: 1, winner: 0 };
        let position = 1;
        mockCollection.findOne.mockImplementationOnce(() => room);
        checkWinner.mockImplementationOnce(() => true);
        room = await dbManager.updateRoom(roomID, playerNumber, position);
        expect(room).toEqual(expected);
    });
});
