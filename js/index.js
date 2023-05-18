'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let jugandoPartida = sessionStorage.getItem('partida');
    //const ranking = JSON.parse(sessionStorage.getItem('ranking'));

    creaRanking();

    if (jugandoPartida) {
        location.href = 'juego.html';
    }
});