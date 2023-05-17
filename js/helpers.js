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
    sessionStorage.setItem('nombres', JSON.stringify(jugadores));
}

function obtieneJugadores() {
    return JSON.parse(sessionStorage.getItem('nombres'));
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

function elegirPrimerTurno() {
    let turno = Math.round(Math.random());

    return turno === 0 ? 'jugador1' : 'jugador2';
}

function creaNumerosDisponibles(numeros) {
    const divNumsDisponibles = document.getElementById('numsDisponibles');
    let html = '';
    numeros.forEach(num => {
        html += `
            <button type="button">${num}</button>
        `;
    });

    divNumsDisponibles.innerHTML = html;

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
    modal.innerHTML = `
        <h3>El turno es del jugador ${turno}</h3>
        <button class="modal" onclick="cerrarModal()">Cerrar</button>
    `;

    document.body.appendChild(modal);
    modal.showModal();
}

function mostrarModalAyuda() {
    const modal = creaPropiedadesModal();
    modal.innerHTML = `
        <h3 style="text-align: center">Ayuda</h3>
        <br>
        <p style="text-align: justify">El juego consiste en ir colocando en las casillas vacías del tablero los números que se proporcionan en grupos de tres. Juegan dos jugadores por turnos. Si al colocar un número en una celda vacía, sumándole el que tiene arriba/abajo/izquierda/derecha se obtiene un múltiplo de 5, se limpian las casillas correspondientes y el resultado de la suma son los puntos que acumula el jugador, manteniendo el turno. El juego finaliza cuando ya no quedan casillas vacías en el tablero, ganando el jugador con mayor puntuación.</p>
        <button class="modal" onclick="cerrarModal()">Cerrar</button>
    `;

    document.body.appendChild(modal);
    modal.showModal();
}

function cerrarModal() {
    document.querySelector('dialog').close();
    document.querySelector('dialog').remove();
}

function guardarInfoPartida({ tablero, nombres, puntuacionesPartida, turnoActual, numerosDisponibles }) {
    sessionStorage.setItem('tablero', tablero);
    sessionStorage.setItem('nombres', JSON.stringify(nombres));
    sessionStorage.setItem('puntuaciones', JSON.stringify(puntuacionesPartida));
    sessionStorage.setItem('turno', turnoActual);
    sessionStorage.setItem('numeros', JSON.stringify(numerosDisponibles));
}

function eliminarInfoPartida() {
    sessionStorage.removeItem('tablero');
    sessionStorage.removeItem('nombres');
    sessionStorage.removeItem('puntuaciones');
    sessionStorage.removeItem('turno');
    sessionStorage.removeItem('numeros');
}

function terminarPartida() {
    eliminarInfoPartida();
    location.href = 'index.html';
}

/* =========================================================================== */
/* HELPERS PARA PREPARAR EL TABLERO DE LA PARTIDA */
/* =========================================================================== */
const ANCHO = 480;
const ALTO = 360;
const NUM_CELDAS = 4;

function getAnchoCelda() {
    return ANCHO / NUM_CELDAS;
}

function getAltoCelda() {
    return ALTO / NUM_CELDAS;
}

function prepararCanvas() {
    let cv = document.querySelector('#tableroJuego');

    cv.width = ANCHO;
    cv.height = ALTO;

    ponerEventos();

    return cv;
}

function ponerEventos() {
    let cv = document.querySelector('#tableroJuego');

    // cv.addEventListener('mousemove', function(evt){ // Para cuando el ratón esté por encima...
    cv.addEventListener('click', evt => {
        let x = evt.offsetX,
            y = evt.offsetY,
            anchoCelda = getAnchoCelda(),
            altoCelda = getAltoCelda(),
            fila,col;

        fila = Math.floor(y / altoCelda);
        col = Math.floor(x / anchoCelda);
        console.log(`(x,y): (${fila}, ${col})`);
    });
}

function creaDivisionesCanvas() {
    let cv = document.querySelector('#tableroJuego'),
        ctx = cv.getContext('2d'),
        anchoCelda = getAnchoCelda(),
        altoCelda = getAltoCelda();
    
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    for (let i = 1; i < NUM_CELDAS; i++) {
        //Verticales
        ctx.moveTo(i * anchoCelda, 0);
        ctx.lineTo( i * anchoCelda, cv.height);

        //Horizontales
        ctx.moveTo(0, i * altoCelda);
        ctx.lineTo(cv.width, i * altoCelda);
    }

    ctx.stroke();
}

/* =========================================================================== */
/* HELPERS PARA PREPARAR LA PAGINA DE LA PARTIDA */
/* =========================================================================== */
function creaMarcador() {
    const jugadores = obtieneJugadores(),
        turno = elegirPrimerTurno();
    
    let marcador = `
        <table>
            <thead>
                <tr>
                    <td>Turno</td>
                    <td>Jugador</td>
                    <td>Puntos</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${turno === 'jugador1' ? '*' : ''}</td>
                    <td>${jugadores.jugador1}</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>${turno === 'jugador2' ? '*' : ''}</td>
                    <td>${jugadores.jugador2}</td>
                    <td>0</td>
                </tr>
            </tbody>
        </table>
    `;

    document.querySelector('div.scoreContainer').innerHTML = marcador;
}