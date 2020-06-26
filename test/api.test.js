"use strict";

const api = require('../src/controllers/api.js');
const dbManager = require('../src/dbmanager.js');
jest.mock('../src/dbmanager.js');

describe("api", () => {
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
            json: jest.fn((r) => console.log(r)),
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
        dbManager.findRoomByUserID = jest.fn(() => res.locals.room);
    });

    test('correct GET request on /api should call res.json()', async () => {
        let response = {
            connected: 2,
            b: [],
            turn: 0,
            winner: null,
            playerNumber: 0
        };
        await api.get(req, res);        
        expect(res.json).toHaveBeenLastCalledWith(response);
    });

    test('GET request on /api when userID is not stored in DB should call res.status(404)', async () => {
        dbManager.findRoomByUserID.mockImplementationOnce(() => {Promise.reject()});
        await api.get(req, res);
        expect(res.status).toHaveBeenLastCalledWith(404);
    });
});