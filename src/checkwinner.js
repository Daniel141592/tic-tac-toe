"use strict";

export default (room) => {
    for (let i = 0; i <= 6; i = i + 3)
        if ((room.board[i] != null) && (room.board[i] == room.board[i + 1] && room.board[i] == room.board[i + 2]))
            return true;

    for (let i = 0; i <= 2; i++)
        if ((room.board[i] != null) && (room.board[i] == room.board[i + 3] && room.board[i] == room.board[i + 6]))
            return true;

    if (((room.board[0] != null) && (room.board[0] == room.board[4] && room.board[0] == room.board[8])) ||
        ((room.board[2] != null) && (room.board[2] == room.board[4] && room.board[2] == room.board[6])))

        return true;
    return false;
};