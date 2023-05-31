'use strict';

function dibujarCanvasActualizado(tablero) {
    let cvs = document.getElementById('tableroJuego'),
        ctx = cvs.getContext('2d');
    
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    creaDivisionesCanvas();
    dibujarCeldasActualizadas(tablero);
}

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
    const ranking = getRanking();

    //sessionStorage.setItem('ranking', JSON.stringify(ranking));

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
    let i = 1;
    for (const jugador in ranking) {
        html += `
            <tr>
                <td>${i}</td>
                <td>${jugador}</td>
                <td>${ranking[jugador]}</td>
            </tr>
        `;
        i++;
    }

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

function mostrarModalFin() {
    const marcador = JSON.parse(sessionStorage.getItem('puntuaciones'));
    let ganador, puntuacion = 0, html = '';
    for (const jugador in marcador) {
        if (marcador[jugador] > puntuacion) {
            ganador = jugador;
            puntuacion = marcador[jugador];
        }

        html += `<p>Jugador ${jugador}: ${marcador[jugador]}</p>`;
    }


    const modal = creaPropiedadesModal();
    modal.innerHTML = `
        <h3>El juego ha terminado!!</h3>
        <p>El jugador ${ganador} ha ganado</p>
        ${html}
        <button class="modal" onclick="cerrarModal()">Aceptar</button>
    `;

    document.body.appendChild(modal);
    modal.showModal();
}

function cerrarModal(finPartida = false) {
    document.querySelector('dialog').close();
    document.querySelector('dialog').remove();

    if (finPartida) {
        // GUARDAR PUNTUACIONES/ACTUALIZAR RANKING
        seleccionaMejoresRanking();

        // BORRAR INFORMACION DE PARTIDA
        eliminarInfoPartida();
        location.href = 'index.html';
    }
}

function guardarInfoPartida({ tablero, nombres, puntuacionesPartida, turnoActual, numerosDisponibles }) {
    sessionStorage.setItem('tablero', JSON.stringify(tablero));
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

function terminarPartida() { // REHACER LOGICA DE FIN DE JUEGO
    mostrarModalFin();


    //location.href = 'index.html';
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

    // OBTENER NUMERO SI LO HA ELEGIDO
    let numerosDisponibles = document.querySelectorAll('div#numsDisponibles>button');

    var numero;
    numerosDisponibles.forEach(async btn => {
        if (btn.classList.contains('seleccionada') && btn.textContent !== undefined) {
            numero = parseInt(btn.textContent);

            // ELIMINAR NUMERO SELECCIONADO DE LA LISTA DE NUMEROS DISPONIBLES
            btn.textContent = ''; // OPCIONAL YA QUE SE ELIMINA EL BOTON
            btn.remove(); // ELIMINA EL BOTON PERO NO SU CONTENEDOR, PARA SIMULAR QUE NO ESTA DISPONIBLE
            btn.classList.remove('seleccionada');
            
            dibujaNumero(fila, col, numero);

            let tableroJson = sessionStorage.getItem('tablero'),
                tablero = JSON.parse(tableroJson);
            console.warn(tablero);

            // ACTUALIZAR VALOR EN MATRIZ Y GUARDAR DE NUEVO
            tablero[fila][col] = numero;
            sessionStorage.setItem('tablero', JSON.stringify(tablero));
            
            //COMPROBAR JUGADA Y GESTIONAR PUNTUACIONES
            let res = await postComprobar(tablero);
            console.log(res);

            if (res.JUGABLES === 0 && res.CELDAS_SUMA.length === 0) { // COMPROBAR SI QUEDAN CELDAS LIBRES PARA JUGAR
                terminarPartida();
            } else {
                let celdasPuntuadas = res.CELDAS_SUMA;

                if (celdasPuntuadas.length > 0) { // SI GANA JUGADA
                    let sumaTotal = 0;
                    celdasPuntuadas.forEach(celdaJson => {
                        let celda = JSON.parse(celdaJson);
                        let { fila, col } = celda;
                        // OBTENER NUMERO DE CADA CELDA PARA SUMAR PUNTUACION
                        let numeroCeldaActual = tablero[fila][col];
                        sumaTotal += numeroCeldaActual;
                        
                        tablero[fila][col] = 0;
                        
                        //console.log(`Suma total: ${sumaTotal}`);
                        //console.error(`i: ${fila}, j: ${col}`);
                        //console.error('Valor: ' + tablero[fila,col]);

                        console.log(`Suma total: ${sumaTotal}`);
                    });
                    sessionStorage.setItem('tablero', JSON.stringify(tablero));

                    console.log(tablero);

                    // PINTAR TABLERO ACTUALIZADO
                    dibujarCanvasActualizado(tablero);

                    // CAMBIAR EL TURNO Y ACTUALIZAR EL MARCADOR
                    //cambiarTurno();
                    actualizaMarcador(sumaTotal);
                }
            }
        }
    });

    // COMPROBAR SI QUEDAN NUMEROS EN LA LISTA Y SI NO SE GENERAN NUEVOS
    if (document.querySelectorAll('div#numsDisponibles>button').length === 0) {
        creaNumerosDisponibles(obtenerNumerosAleatorios());
    }
}

/*function obtenerCeldaSeleccionada() {
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
}*/

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

function dibujarCeldasActualizadas(tablero) {
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
            } else if (tablero[i][j] !== 0) { // SE PINTAN LOS VALORES NUMERICOS EN LA CELDA
                dibujaNumero(i, j, tablero[i][j]);
            }
        }
    }
}

// IMPRIME EL NÚMERO CORRESPONDIENTE EN LA CELDA SELECCIONADA
function dibujaNumero(i, j, numero = '') {
    let cvs = document.getElementById('tableroJuego'),
        ctx = cvs.getContext('2d');

    let posX = j*getAnchoCelda() + getAnchoCelda()/2,
        posY = i*getAltoCelda() + getAltoCelda()/2;
    
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

function ordenarRanking(ranking) {
    let ordenados = Object.entries(ranking).sort(function(a, b) {
        return b[1] - a[1];
    });
    let top10 = ordenados.slice(0, 10);
    let rankOrdenado = Object.fromEntries(top10);

    return rankOrdenado;
}

function seleccionaMejoresRanking(puntosPartida) {
    let ranking = getRanking();
    console.log(ranking);
    console.warn(puntosPartida);

    let puntuacionesCombinadas = Object.assign({}, ranking, puntosPartida);

    let rankingActualizado = ordenarRanking(puntuacionesCombinadas);
    setRanking(rankingActualizado);


    /*let jugadoresRank = Object.keys(ranking);

    // COMPROBAR SI HAY 10 JUGADORES EN EL RANKING
    if (jugadoresRank.length === 10) {


        //OBTENER ULTIMO JUGADOR DEL RANKING
        let ultimoRank = jugadoresRank[jugadoresRank.length - 1];

        for (const jugPartida in puntosPartida) {
            for (const jugadorRank in ranking) {
                // COMPROBAR SI LA PUNTUACION ESTA ENTRE LOS MEJORES
                console.log(`Pts ultimo jugador rank: `+ ranking[ultimoRank]);
                console.log(`Pts jugador actual partida: `+ puntosPartida[jugPartida]);
    
                if (ranking[ultimoRank] < puntosPartida[jugPartida]) {
                    delete ranking[ultimoRank];
                    ranking[jugadorRank] = puntosPartida[jugPartida];
                    let orden = ordenarRanking();
                    console.log(orden);
                    //setRanking(orden);
                }
            }
        }
        let ordenado = ordenarRanking(ranking);
        //console.log(ordenado);

    } else { // HAY MENOS DE 10 JUGADORES EN RANKING
        for (const jugadorPartida in puntosPartida) {
            if (jugadoresRank.length < 10) {
                ranking[jugadorPartida] = puntosPartida[jugadorPartida];
            }
        }
        ordenarRanking(ranking);
    }*/
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
        puntuaciones = sessionStorage.getItem('puntuaciones'),
        turnoActual = sessionStorage.getItem('turno');
    
    if (puntos) {
        // ACTUALIZAR PUNTUACIONES
        let puntosJugadores = JSON.parse(puntuaciones);
        puntosJugadores[turnoActual] = parseInt(puntosJugadores[turnoActual]) + puntos;

        sessionStorage.setItem('puntuaciones', JSON.stringify(puntosJugadores));

        let puntosJ1 = document.querySelector('td.puntosJ1'),
            puntosJ2 = document.querySelector('td.puntosJ2'),
            i = 0;
        
        for (const key in puntosJugadores) {
            if (i === 0) {
                puntosJ1.textContent = puntosJugadores[key];
            } else {
                puntosJ2.textContent = puntosJugadores[key];
            }

            i++;
        }
    }

    //puntosJ1.textContent = puntosJugadores[]

    cambiarTurno();

    if (celdasTurno[0].textContent === '*') {
        celdasTurno[0].textContent === '';
        celdasTurno[1].textContent === '*';
    } else {
        celdasTurno[0].textContent === '*';
        celdasTurno[1].textContent === '';
    }

    
}