"use strict";

const mainpage = require('./../src/mainpage.js');
const User = require('./../src/user.js');

jest.mock('./../src/user.js');

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
            status: jest.fn(() => res),
            send: jest.fn()
        };
    });

    test('correct request on main page should create new User instance', async () => {
        await mainpage(req, res);
        expect(User).toHaveBeenCalled();
    });

    test('request without "nick" should call res.status(400)', async () => {
        req.body = null;
        await mainpage(req, res);
        expect(res.status).toHaveBeenLastCalledWith(400);
    });

    test('correct request on main page should call res.redirect()', async () => {
        await mainpage(req, res);
        expect(res.redirect).toHaveBeenCalled();
    });
});