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

function obtienePartida() {
    return sessionStorage.getItem('partida');
}

function obtenerNumerosAleatorios() { //NUMEROS ALEATORIOS PARA JUGAR
    let numeros = [], asignados = false;

    while (!asignados) {
        if (numeros.length < 3) {
            let random = Math.floor(Math.random() * 9) + 1;
            if (!numeros.includes(random) && random !== 5) {
                numeros.push(random);
            }
        } else {
            asignados = true;
        }
    }

    return numeros;
}

function elegirTurnoJugador() {
    let turno = Math.round(Math.random());

    return turno === 0 ? 'jugador1' : 'jugador2';
}