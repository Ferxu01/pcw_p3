'use strict';

function enviaJugadores(evt) {
    evt.preventDefault();
    let fd = new FormData(evt.currentTarget),
        jugador1 = fd.get('player1'),
        jugador2 = fd.get('player2');

    if (!compruebaVacio(jugador1, jugador2)) {
        guardaJugadores({
            jugador1,
            jugador2
        });
        location.href = 'juego.html';
    }
}

function guardaJugadores(jugadores) {
    sessionStorage.setItem('jugadores', JSON.stringify(jugadores));
}

function obtieneJugadores() {
    return JSON.parse(sessionStorage.getItem('jugadores'));
}

function compruebaVacio(player1, player2) {
    return player1 === '' || player2 === '';
}