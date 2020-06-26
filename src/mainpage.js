"use strict";

const User = require('./user.js');

module.exports = async (req, res) => {
    if (req.body == null || req.body.nick.trim() == "") {
        res.status(400).send('brak nicku lub pusty');
        return;
    }
    let user = new User(req.body.nick);
    res.cookie('user', user.id);
    let roomID = await user.assign();

	res.redirect('/'+roomID);
};