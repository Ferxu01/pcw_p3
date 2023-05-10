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

//CREAR MODAL Y ESTABLECER ESTILOS PRINCIPALES
function creaPropiedadesModal() {
    let dialogo = document.createElement('dialog');
    dialogo.style.padding = '25px';
    dialogo.style.fontFamily = 'Arial';
    dialogo.style.position = 'fixed';
    dialogo.style.top = '50%';
    dialogo.style.left = '50%';
    dialogo.style.transform = 'translate(-50%, -50%)';
    return dialogo;
}

function mostrarModalTurno() {
    const turno = sessionStorage.getItem('turno');
    const modal = creaPropiedadesModal();
    dialog.innerHTML = `
        <h3>El turno es del jugador ${turno}</h3>
    `;

    document.body.appendChild(modal);
    modal.showModal();
}

function guardarInfoPartida({ tablero, nombres, puntuacionesPartida, turnoActual, numerosDisponibles }) {
    sessionStorage.setItem('tablero', tablero);
    sessionStorage.setItem('nombres', JSON.stringify(nombres));
    sessionStorage.setItem('puntuaciones', JSON.stringify(puntuacionesPartida));
    sessionStorage.setItem('turno', turnoActual);
    sessionStorage.setItem('numeros', JSON.stringify(numerosDisponibles));
}