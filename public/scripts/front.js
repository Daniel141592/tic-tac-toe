"use strict";

$(document).ready(() => {
    const socket = new WebSocket('ws://localhost:3300');
    socket.addEventListener('open', event => {
        $("form").submit(event => {
            return false;
        });
    
        $("button").click(action);
    
        socket.addEventListener('message', event => {
            let messages = ["Teraz krzyżyk", "Teraz kółko", "Oczekiwanie na gracza..."];
            let s = ["×", "⃝"];
            let message = "";
            console.log(event.data);
            let result = JSON.parse(event.data);

            if (result.draw == true) {
                message += "<span class=\"active\">Remis!</span>"
            } else if (result.winner != null) {
                message += "<span " + (result.playerNumber == result.winner ? "class=active>" : ">") + " Wygrywa " + result.nicks[result.winner] + "</span>";
            } else {
                message += messages[result.turn];
                if (result.turn == 0 || result.turn == 1) {
                    message += "<span " + (result.playerNumber == result.turn ? "class=active>" : ">") + " (" + result.nicks[result.turn] + ")</span>";
                }
            }
            $("#message").html(message);
            let buttons = $("[name='position']");

            for (let i = 0; i < 9; i++) {
                if (result.playerNumber == result.board[i])
                    buttons.eq(i).html("<span class=\"active\">" + s[result.board[i]] + "</span>");
                else
                    buttons.eq(i).html(s[result.board[i]]);
            }
        });
    
        function action(event) {
            socket.send($(event.target).attr("value"));
        }
    });
});