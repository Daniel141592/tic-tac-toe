"use strict";

const api = require('../src/controllers/api.js');
const dbManager = require('../src/dbmanager.js');
const User = require('../src/user.js');

jest.mock('../src/dbmanager.js');
const mockUserAssign = jest.fn();
const mockUserJoin = jest.fn();
jest.mock('../src/user.js', () => {
    return jest.fn(() => {
        return {
            assign: mockUserAssign,
            join: mockUserJoin
        };
    });
});

describe("api", () => {
    let req;
    let res;
    let next = jest.fn();
    const ID = 1;

    beforeEach(() => {
        mockUserAssign.mockClear();
        mockUserJoin.mockClear();
        
        req = {
            body: { nick: "test123", position: null},
            cookies: { user: "_abcdefghi" },
            params: { id: ID }
        };

        res = {
            cookie: jest.fn(),
            json: jest.fn(),
            status: jest.fn(() => res),
            send: jest.fn(),
            locals: {
                playerNumber: 0,
                room: {
                    _id: ID,
                    connected: 2,
                    uIDs: [req.cookies.user, "_987654321"],
                    board: [],
                    turn: 0,
                    winner: null
                },
                response: {}
            }
        };

        dbManager.updateRoom = jest.fn();
        dbManager.findRoom = jest.fn(() => res.locals.room);
        dbManager.findRoomByUserID = jest.fn(() => res.locals.room);
    });

    test('correct GET request on /api should call res.json()', async () => {
        let response = {
            _id: ID,
            connected: 2,
            board: [],
            turn: 0,
            winner: null,
            playerNumber: 0
        };
        await api.get(req, res);        
        expect(res.json).toHaveBeenLastCalledWith(response);
    });

    test('GET request on /api when userID is not stored in DB should call res.status(404)', async () => {
        dbManager.findRoomByUserID.mockImplementationOnce(() => { Promise.reject() });
        await api.get(req, res);
        expect(res.status).toHaveBeenLastCalledWith(404);
    });

    test('GET request on /api/rooms/:id/check with id of non-full room should set res.locals.response.canJoin to true', async () => {
        res.locals.room.uIDs = ["_123456789"];
        res.locals.room.connected = 1;
        res.locals.room.turn = 2;
        await api.check(req, res, next);
        expect(res.locals.response.canJoin).toBe(true);
    });

    test('GET request on /api/rooms/:id/check with id of non-existing room should set res.locals.response.canJoin to false', async () => {
        dbManager.findRoom.mockImplementationOnce(() => {null});
        await api.check(req, res, next);
        expect(res.locals.response.canJoin).toBe(false);
    });

    test('POST request on /api/rooms/create should call User.assign()', async () => {
        await api.create(req, res);
        expect(mockUserAssign).toHaveBeenCalled();
    });

    test('POST request on /api/rooms/:id/join with id of non-full room should call User.join()', async () => {
        res.locals.room.uIDs = ["_123456789"];
        res.locals.room.connected = 1;
        res.locals.room.turn = 2;
        res.locals.response.canJoin = true;
        await api.joinRoom(req, res);
        expect(mockUserJoin).toHaveBeenCalled();
    });

    test('POST request on /api/rooms/update with no params should call res.status(400)', async () => {
        await api.updateRoom(req, res);
        expect(res.status).toHaveBeenLastCalledWith(400);
    });

    test('POST request on /api/rooms/update with incorrect param should call res.status(400)', async () => {
        req.body.position = "12";
        await api.updateRoom(req, res);
        expect(res.status).toHaveBeenLastCalledWith(400);
    });

    test('correct POST request on /api/rooms/update should call dbManager.updateRoom()', async () => {
        req.body.position = 3;
        await api.updateRoom(req, res);
        expect(dbManager.updateRoom).toHaveBeenLastCalledWith(res.locals.room._id, res.locals.room.playerNumber, req.body.position);
    });
});