"use strict";

$(document).ready(() => {
    function action() {
        $.ajax({
            url: "/api",
            dataType: "json",
            success: result => {
                let messages = ["Teraz krzyżyk", "Teraz kółko", "Oczekiwanie na gracza..."];
                let message = "";
                if (result.draw == true) {
                    message += "<span class=\"active\">\"Remis!\"</span>"
                } else if (result.winner != null) {
                    message += "<span " + (result.playerNumber == result.winner ? "class=active>" : ">") + " Wygrywa " + result.nicks[result.winner] + "</span>";
                } else {
                    message += messages[result.turn];
                    if (result.turn == 0 || result.turn == 1) {
                        message += "<span "+(result.playerNumber == result.turn ? "class=active>" : ">") +" (" + result.nicks[result.turn] + ")</span>"; 
                    }
                }
                $("#message").html(message);
                let buttons = $("[name='b']");

                for (let i = 0; i < 9; i++) {
                    buttons.eq(i).html(result.b[i]);
                }
            },
            error: (xhr, status, err) => {
                console.log(err);
                clearInterval(interval);
            }
        });
    }
    action();
    let interval = setInterval(action, 1000);
});