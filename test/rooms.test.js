"use strict";

const rooms = require('./../src/rooms.js');
const User = require('./../src/user.js');
const dbManager = require('./../src/dbmanager.js');

jest.mock('./../src/user.js');
jest.mock('./../src/dbmanager.js');

describe("rooms", () => {
    let req;
    let res;
    let next = jest.fn();
    const ID = 1;

    beforeEach(() => {
        req = {
            body: { nick: "test123", b: null},
            cookies: { user: "_abcdefghi" },
            params: { id: ID }
        };

        res = {
            cookie: jest.fn(),
            redirect: jest.fn(),
            render: jest.fn(),
            sendFile: jest.fn(),
            status: jest.fn(() => res),
            send: jest.fn(),
            locals: {
                playerNumber: 0,
                room: {
                    connected: 2,
                    uIDs: [req.cookies.user, "_987654321"],
                    b: [],
                    turn: 0,
                    winner: null
                }
            }
        };

        dbManager.updateRoom = jest.fn();
        dbManager.findRoom = jest.fn(() => res.locals.room);
    });

    test('request on full room should call res.redirect("/")', async () => {
        res.locals.room.uIDs[0] = "_123456789";
        await rooms.check(req, res);
        expect(res.redirect).toHaveBeenLastCalledWith('/');
    });

    test('request on room which does not exist should call res.redirect("/")', async () => {
        res.locals.room = null;
        await rooms.check(req, res);
        expect(res.redirect).toHaveBeenLastCalledWith('/');
    });

    test('new player request on non-full room - check() should call next()', async () => {
        res.locals.room = {
            connected: 1,
            uIDs: ["_123456789"]
        };
        await rooms.check(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('new player GET request should call res.sendFile(.../views/initform.html)', async () => {
        res.locals.playerNumber = null;
        await rooms.get(req, res);
        expect(res.sendFile).toHaveBeenLastCalledWith(expect.stringMatching(/\\views\\initform.html$/));
    });

    test('known player GET request should call res.render("board")', async () => {
        await rooms.get(req, res);
        expect(res.render).toHaveBeenLastCalledWith('board');
    });

    test('new player POST request without "nick" should call res.status(400)', async () => {
        res.locals.playerNumber = null;
        req.body = null;
        await rooms.post(req, res);
        expect(res.status).toHaveBeenLastCalledWith(400);
    });

    test('new player POST should create new User instance', async () => {
        res.locals.playerNumber = null;
        await rooms.post(req, res);
        expect(User).toHaveBeenCalled();
    });

    test('new player POST should call res.render("board")', async () => {
        res.locals.playerNumber = null;
        await rooms.post(req, res);
        expect(res.render).toHaveBeenLastCalledWith('board');
    });

    test ('POST request with incorrect board index should call res.status(400)', async () => {
        req.body.b = '10';
        await rooms.post(req, res);
        expect(res.status).toHaveBeenLastCalledWith(400);
    });

    test('correct POST request with new data should call dbManager.updateRoom(ID, playerNumber, b)', async () => {
        req.body.b = 1;
        await rooms.post(req, res);
        expect(dbManager.updateRoom).toHaveBeenLastCalledWith(ID, res.locals.playerNumber, req.body.b);
    });

    test('correct POST request without new data should not call dbManager.updateRoom()', async () => {
        req.body.b = 1;
        res.locals.room.b = ["x", "o"];
        await rooms.post(req, res);
        expect(dbManager.updateRoom).not.toHaveBeenCalled();
    });

    test('correct POST request when playerNumber != turn should not call dbManager.updateRoom()', async () => {
        req.body.b = 1;
        res.locals.room.b = ["x"];
        res.locals.room.turn = 1;
        await rooms.post(req, res);
        expect(dbManager.updateRoom).not.toHaveBeenCalled();
    });

    test('correct POST request when winner != null should not call dbManager.updateRoom()', async () => {
        req.body.b = 1;
        res.locals.room.b = ["x"];
        res.locals.room.winner = 1;
        await rooms.post(req, res);
        expect(dbManager.updateRoom).not.toHaveBeenCalled();
    });

    test('correct POST request should call res.render("board")', async () => {
        req.body.b = 1;
        await rooms.post(req, res);
        expect(res.render).toHaveBeenLastCalledWith('board');
    });
});