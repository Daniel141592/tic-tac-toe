"use strict";

module.exports = (room) => {
    for (let i = 0; i <= 6; i = i + 3)
        if ((room.b[i] != null) && (room.b[i] == room.b[i + 1] && room.b[i] == room.b[i + 2]))
            return true;

    for (let i = 0; i <= 2; i++)
        if ((room.b[i] != null) && (room.b[i] == room.b[i + 3] && room.b[i] == room.b[i + 6]))
            return true;

    if (((room.b[0] != null) && (room.b[0] == room.b[4] && room.b[0] == room.b[8])) ||
        ((room.b[2] != null) && (room.b[2] == room.b[4] && room.b[2] == room.b[6])))

        return true;
    return false;
};