"use strict";

const dbManager = require('./dbmanager.js');

class User {
    constructor(nick) {
        this.nick = nick;
        this.formatNick();
        this.generateID();
    }

    assign() {
        return new Promise(callback => {
            callback(dbManager.createRoom(this.nick, this.id));
        });
    }

    join(roomID) {
        dbManager.joinRoom(roomID, this.nick, this.id);
    }

    generateID() {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
    }

    formatNick() {
        this.nick = this.nick.trim();
        if (this.nick.length > 30)
            this.nick = this.nick.substr(0, 30);
    }
}

module.exports = User;