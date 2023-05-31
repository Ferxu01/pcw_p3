'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let partidaEmpezada = jugandoPartida();

    creaRanking();

    if (partidaEmpezada) {
        location.href = 'juego.html';
    }
});