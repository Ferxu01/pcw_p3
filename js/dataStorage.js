'use strict';

function setJugadores(jugadores) {
    if (jugadores) {
        sessionStorage.setItem('nombres', JSON.stringify(jugadores));
    }
}

function getJugadores() {
    let jugadores = sessionStorage.getItem('nombres');
    return JSON.parse(jugadores);
}

function jugandoPartida() {
    return getTableroJuego() && getNombres() && getPuntuaciones() && getTurno() && getNumeros();
}

function getRanking() {
    let ranking = sessionStorage.getItem('ranking');
    return JSON.parse(ranking);
}

function setRanking(ranking) {
    if (ranking) {
        sessionStorage.setItem('ranking', JSON.stringify(ranking));
    }
}

function getTableroJuego() {
    let tablero = sessionStorage.getItem('tablero');
    return JSON.parse(tablero);
}

function setTablero(tablero) {
    if (tablero) {
        sessionStorage.setItem('tablero', JSON.stringify(tablero));
    }
}

function getTurno() {
    return sessionStorage.getItem('turno');
}

function setTurno(turno) {
    if (turno) {
        sessionStorage.setItem('turno', turno);
    }
}

function getPuntuaciones() {
    let puntuaciones = sessionStorage.getItem('puntuaciones');
    return JSON.parse(puntuaciones);
}

function setPuntuaciones(puntuaciones) {
    if (puntuaciones) {
        sessionStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));
    }
}

function getNombres() {
    let nombres = sessionStorage.getItem('nombres');
    return JSON.parse(nombres);
}

function setNombres(nombres) {
    if (nombres) {
        sessionStorage.setItem('nombres', JSON.stringify(nombres));
    }
}

function getNumeros() {
    let numeros = sessionStorage.getItem('numeros');
    return JSON.parse(numeros);
}
function setNumeros(numerosDisponibles) {
    if (numerosDisponibles) {
        sessionStorage.setItem('numeros', JSON.stringify(numerosDisponibles));
    }
}

function setInfoPartida({ tablero, nombres, puntuacionesPartida, turnoActual, numerosDisponibles }) {
    setTablero(tablero);
    setNombres(nombres);
    setPuntuaciones(puntuacionesPartida);
    setTurno(turnoActual);
    setNumeros(numerosDisponibles);
}

function eliminarInfoPartida() {
    sessionStorage.removeItem('tablero');
    sessionStorage.removeItem('nombres');
    sessionStorage.removeItem('puntuaciones');
    sessionStorage.removeItem('turno');
    sessionStorage.removeItem('numeros');
}