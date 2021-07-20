"use strict";

import User from '../user.js';
import path from 'path';
const __dirname = path.resolve();

function get(req, res) {
    res.sendFile(path.join(__dirname, "views/initform.html"));
}

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