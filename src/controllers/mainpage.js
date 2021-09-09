"use strict";

import User from '../user.js';
import path from 'path';
const __dirname = path.resolve();

/**
 * GET request to main page
 */
function get(req, res) {
    res.sendFile(path.join(__dirname, "views/initform.html"));
}

/**
 * POST request to main page. Happens when user sends his nick and starts new game.
 */
async function post(req, res) {
    if (req.body == null || req.body.nick == null || req.body.nick.trim() == "") {
        res.status(400).send('brak nicku lub pusty');
        return;
    }
    let user = new User(req.body.nick);
    res.cookie('user', user.id);
    let roomID = await user.assign();

	res.redirect('/'+roomID);
}

export {
    post,
    get
};