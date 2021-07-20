"use strict";

import * as mainpage from './../src/controllers/mainpage.js';
//const User = require('./../src/user.js');

const mockUserAssign = jest.fn();
jest.mock('./../src/user.js', () => {
    return jest.fn(() => {
        return {
            assign: mockUserAssign
        };
    });
});

describe('mainpage', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: { nick: "test123" }
        };

        res = {
            cookie: jest.fn(),
            redirect: jest.fn(),
            sendFile: jest.fn(),
            status: jest.fn(() => res),
            send: jest.fn()
        };
    });

    test('GET request on main page should call res.sendFile()', () => {
        mainpage.get(req, res);
        expect(res.sendFile).toHaveBeenCalled();
    });

    test('correct request on main page should call User.assign()', async () => {
        await mainpage.post(req, res);
        expect(mockUserAssign).toHaveBeenCalled();
    });

    test('request without "nick" should call res.status(400)', async () => {
        req.body = null;
        await mainpage.post(req, res);
        expect(res.status).toHaveBeenLastCalledWith(400);
    });

    test('correct request on main page should call res.redirect()', async () => {
        await mainpage.post(req, res);
        expect(res.redirect).toHaveBeenCalled();
    });
});