"use strict";

import * as dbManager from './dbmanager.js';

/**
 * Class representing single user(player)..
 * @field {String} nick - nick of player
 */
class User {
    constructor(nick) {
        this.nick = nick;
        this.formatNick();
        this.generateID();
    }

    /**
     * Create room and assign user to it.
     * @returns Promise object returning object from database containing data about created room
     */
    assign() {
        return new Promise(callback => {
            callback(dbManager.createRoom(this.nick, this.id));
        });
    }

    /**
     * Join user to specified room.
     * @param {int} roomID - id of room to join
     */
    join(roomID) {
        dbManager.joinRoom(roomID, this.nick, this.id);
    }

    /**
     * Generate user ID.
     */
    generateID() {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Format user nick.
     */
    formatNick() {
        this.nick = this.nick.trim();
        if (this.nick.length > 30)
            this.nick = this.nick.substr(0, 30);
    }
}

export default User;