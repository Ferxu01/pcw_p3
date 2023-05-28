'use strict';

var numeroSeleccionado = undefined;

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
    let jugadores = obtieneJugadores();
    let jugadorTurno;

    if (turno === 0) {
        jugadorTurno = jugadores['jugador1'];
        sessionStorage.setItem('turno', jugadorTurno);
    } else {
        jugadorTurno = jugadores['jugador2'];
        sessionStorage.setItem('turno', jugadorTurno);
    }

    return jugadorTurno;
}

function cambiarTurno() {
    let jugadores = obtieneJugadores(),
        turno = sessionStorage.getItem('turno'),
        nuevoTurno;
    
    if (turno === jugadores['jugador1'])
        nuevoTurno = jugadores['jugador2'];
    else
        nuevoTurno = jugadores['jugador1'];
    
    sessionStorage.setItem('turno', nuevoTurno);
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

function creaRanking() {
    //const ranking = sessionStorage.getItem('ranking');

    let ranking = {
        aaaaa: 70,
        bbbbb: 120
    }

    sessionStorage.setItem('ranking', JSON.stringify(ranking));

    let html = `
        <table>
        <thead>
            <tr>
                <th>Pos.</th>
                <th>Usuario</th>
                <th>Puntuación</th>
            </tr>
        </thead>
        <tbody>
    `;

    // Si existe ranking
    for (const jugador in ranking) {
        console.warn(jugador);
        console.warn(ranking[jugador]);

        html += `
            <tr>
                <td>1</td>
                <td>${jugador}</td>
                <td>${ranking[jugador]}</td>
            </tr>
        `;
    }
    /*html += `
        <tr>
            <td>1</td>
            <td>Juan</td>
            <td>230<td>
        </tr>
        <tr>
            <td>2</td>
            <td>Ana</td>
            <td>196</td>
        </tr>
        <tr>
            <td>3</td>
            <td>Pedro</td>
            <td>190</td>
        </tr>
        <tr>
            <td>4</td>
            <td>Jose</td>
            <td>118</td>
        </tr>
        <tr>
            <td>5</td>
            <td>Patricia</td>
            <td>108</td>
        </tr>
    `;*/

    // Si no existe ranking
    if (!ranking) {
        html += `
            <tr>
                <td colspan="3">Todavía no hay puntuaciones guardadas. ¡¡¡Sé el primero en conseguir una puntuación máxima!!!</td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    `;

    document.getElementById('ranking').innerHTML = html;
}

function creaNumerosDisponibles(numeros) {
    const divNumsDisponibles = document.getElementById('numsDisponibles');
    let html = '';
    numeros.forEach(num => {
        html += `
            <button type="button" onclick="seleccionaNumeroDisponible(event)">${num}</button>
        `;
    });

    divNumsDisponibles.innerHTML = html;

}

function seleccionaNumeroDisponible(evt) {
    console.log(evt.target);
    evt.target.classList.add('seleccionada');
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

    //obtenerCeldaSeleccionada();

    return cv;
}

function obtenerCelda(evt) {
    let x = evt.offsetX,
        y = evt.offsetY,
        anchoCelda = getAnchoCelda(),
        altoCelda = getAltoCelda(),
        fila, col;

    fila = Math.floor(y / altoCelda);
    col = Math.floor(x / anchoCelda);
    console.log(`(x,y): (${fila}, ${col})`);

    // OBTENER NUMERO SI LO HA ELEGIDO
    let numerosDisponibles = document.querySelectorAll('div#numsDisponibles>button');


    var numero;
    numerosDisponibles.forEach(btn => {
        if (btn.classList.contains('seleccionada') && btn.textContent !== undefined) {
            btn.classList.remove('seleccionada');
            numero = parseInt(btn.textContent);
            dibujaNumero(fila, col, numero);

            // CAMBIAR EL TURNO Y ACTUALIZAR EL MARCADOR
            cambiarTurno();
            actualizaMarcador();
        }
    });

    //return { fila, col };
}

function obtenerCeldaSeleccionada() {
    let cv = document.querySelector('#tableroJuego');

    cv.addEventListener('click', evt => {
        let x = evt.offsetX,
            y = evt.offsetY,
            anchoCelda = getAnchoCelda(),
            altoCelda = getAltoCelda(),
            fila,col;

        fila = Math.floor(y / altoCelda);
        col = Math.floor(x / anchoCelda);
        console.log(`(x,y): (${fila}, ${col})`);

        return { fila, col };
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

function marcarCeldasNoJugables(tablero) {
    let cvs = document.getElementById('tableroJuego'),
        ctx = cvs.getContext('2d');

    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            if (tablero[i][j] === -1) {
                // Marcar la celda con otro color para inhabilitarla
                let x = getAnchoCelda()*j,
                    y = getAltoCelda()*i;

                ctx.fillStyle = '#fff';
                ctx.fillRect(x, y, getAnchoCelda(), getAltoCelda());
            }
        }
    }
}

// IMPRIME EL NÚMERO CORRESPONDIENTE EN LA CELDA SELECCIONADA
function dibujaNumero(i, j, numero) {
    let cvs = document.getElementById('tableroJuego'),
        ctx = cvs.getContext('2d');

        console.warn(`i: ${i}, j: ${j}`);
    
    console.error(`Ancho celda: ${getAnchoCelda()}, Alto celda: ${getAltoCelda()}`);

    let posX = j*getAnchoCelda() + getAnchoCelda()/2,
        posY = i*getAltoCelda() + getAltoCelda()/2;

        console.log(`PosX: ${posX}, PosY: ${posY}`);
    
    ctx.fillStyle = '#0a0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'normal 55px Sigmar';
    ctx.fillText(numero, posX, posY);
    ctx.beginPath();
    
    ctx.stroke();
}

/* =========================================================================== */
/* HELPERS PARA PREPARAR LA CLASIFICACIÓN DE PUNTOS */
/* =========================================================================== */

function seleccionaMejoresRanking(puntuacionesFin) {
    let ranking = getRanking();
    console.log(ranking);

    let puntuaciones = puntuacionesFin.map((puntuacion, i) => {
        console.warn(i);
        console.log(puntuacion);
    });
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
                    <td class="celdaTurno">${turno === jugadores.jugador1 ? '*' : ''}</td>
                    <td>${jugadores.jugador1}</td>
                    <td class="puntosJ1">0</td>
                </tr>
                <tr>
                    <td class="celdaTurno">${turno === jugadores.jugador2 ? '*' : ''}</td>
                    <td>${jugadores.jugador2}</td>
                    <td class="puntosJ2">0</td>
                </tr>
            </tbody>
        </table>
    `;

    document.querySelector('div.scoreContainer').innerHTML = marcador;
}

function actualizaMarcador(puntos = undefined) { // ACTUALIZA MARCADOR DE TURNO/PUNTOS
    let celdasTurno = document.getElementsByClassName('celdaTurno'),
        puntuaciones = sessionStorage.getItem('puntuaciones');

        console.warn(puntuaciones);

    if (celdasTurno[0].textContent === '*') {
        celdasTurno[0].textContent === '';
        celdasTurno[1].textContent === '*';
    } else {
        celdasTurno[0].textContent === '*';
        celdasTurno[1].textContent === '';
    }

    // ACTUALIZAR PUNTUACIONES
    let puntuacionJugadores = JSON.parse(puntuaciones);
    console.log(puntuacionJugadores);
}