'use strict';

function enviaJugadores(evt) {
    evt.preventDefault();
    let fd = new FormData(evt.currentTarget),
        jugador1 = fd.get('player1'),
        jugador2 = fd.get('player2');

    if (!compruebaVacio(jugador1, jugador2)) {
        setJugadores({
            jugador1,
            jugador2
        });
        location.href = 'juego.html';
    }
}

function compruebaVacio(player1, player2) {
    return player1 === '' || player2 === '';
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
    let turno = Math.round(Math.random()), 
        jugadores = getJugadores(),
        jugadorTurno;

    if (turno === 0) {
        jugadorTurno = jugadores['jugador1'];
    } else {
        jugadorTurno = jugadores['jugador2'];
    }
    setTurno(jugadorTurno);

    return jugadorTurno;
}

function setTurnoMarcador(turno) {
    let jugadores = getJugadores(),
        celdasTurno = document.getElementsByClassName('celdaTurno');

    if (jugadores['jugador1'] === turno) {
        celdasTurno[0].textContent = '*';
        celdasTurno[1].textContent = '';

        celdasTurno[0].parentElement.classList.add('turnoActual');
        celdasTurno[1].parentElement.classList.remove('turnoActual');
    } else {
        celdasTurno[0].textContent = '';
        celdasTurno[1].textContent = '*';

        // CAMBIAR FONDO TRANSPARENTE DE FILA
        celdasTurno[0].parentElement.classList.remove('turnoActual');
        celdasTurno[1].parentElement.classList.add('turnoActual');
    }
}

function cambiarTurno(primerTurno = undefined) {
    let jugadores = getJugadores(),
        turno = getTurno(),
        nuevoTurno;
    
    if (!primerTurno) {
        if (turno === jugadores['jugador1'])
            nuevoTurno = jugadores['jugador2'];
        else
            nuevoTurno = jugadores['jugador1'];

        setTurnoMarcador(nuevoTurno);
        setTurno(nuevoTurno);
    } else {
        setTurnoMarcador(turno);
    }
}

function creaRanking() {
    const ranking = getRanking();

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

    html += `</tbody></table>`;

    document.getElementById('ranking').innerHTML = html;
}

function creaNumerosDisponibles(numeros) {
    // ACTUALIZAR NUEVOS VALORES EN STORAGE
    setNumeros(numeros);

    const divNumsDisponibles = document.getElementById('numsDisponibles');
    let html = '';
    numeros.forEach(num => {
        html += `
            <div class="numeroDiv" onmouseover="compruebaPunteroNumeros(event)">
                <button type="button" onclick="seleccionaNumeroDisponible(event)">${num}</button>
            </div>
        `;
    });

    divNumsDisponibles.innerHTML = html;
}

function compruebaPunteroNumeros(evt) {
    // SABER EL TIPO DE ELEMENTO HTML QUE TIENE EL ELEMENTO "MAS SUPERIOR" DE LA INTERFAZ
    let tipoElemento = evt.target.tagName;

    if (tipoElemento === 'BUTTON') {
        evt.target.style.cursor = 'pointer';
    } else if (tipoElemento === 'DIV') {
        evt.target.style.cursor = 'not-allowed';
    }
}

function compruebaSeleccionados() {
    return document.querySelectorAll('div#numsDisponibles>div>button.seleccionada').length === 0;
}

// COMPRUEBA SI HAY MAS DE UN NUMERO SELECCIONADO
function seleccionaNumeroDisponible(evt) {
    let listaBotones = evt.target.parentElement.parentElement.getElementsByTagName('button');

    for (var i = 0; i < listaBotones.length; i++) {
        var boton = listaBotones[i];
        if(boton.classList.contains('seleccionada')) {
            boton.classList.remove('seleccionada');

        }
    }
    evt.target.classList.add('seleccionada');
}

function forzarTerminarPartida() {
    eliminarInfoPartida();
    location.href = 'index.html';
}

function terminarPartida() { // REHACER LOGICA DE FIN DE JUEGO
    mostrarModalFin();
}

function compruebaCeldaHabilitada(fila, col) {
    let tablero = getTableroJuego();
    return parseInt(tablero[fila][col]) !== -1;
}

function compruebaCeldaDisponible(fila, col) {
    let tablero = getTableroJuego(),
        valorCelda = parseInt(tablero[fila][col]);
    return valorCelda !== -1 && valorCelda === 0;
}

function obtenerPosicionCelda(evt) {
    let x = evt.offsetX,
        y = evt.offsetY,
        anchoCelda = getAnchoCelda(),
        altoCelda = getAltoCelda(),
        fila, col;

    fila = Math.floor(y / altoCelda);
    col = Math.floor(x / anchoCelda);

    return { fila, col };
}

function obtenerCelda(evt) {
    let { fila, col } = obtenerPosicionCelda(evt);

    if (compruebaCeldaDisponible(fila, col)) {
        realizaJugada(fila, col);
    }
}

function realizaJugada(fila, col) {
    // OBTENER NUMERO SI LO HA ELEGIDO
    let numsDisponibles = document.querySelectorAll('div#numsDisponibles>div>button');

    var numero;
    numsDisponibles.forEach(async btn => {
        if (btn.classList.contains('seleccionada') && btn.textContent !== undefined) {
            numero = parseInt(btn.textContent);

            // ELIMINAR NUMERO SELECCIONADO DE LA LISTA DE NUMEROS DISPONIBLES
            /*btn.textContent = ''; // OPCIONAL YA QUE SE ELIMINA EL BOTON
            btn.remove(); // ELIMINA EL BOTON PERO NO SU CONTENEDOR, PARA SIMULAR QUE NO ESTA DISPONIBLE
            btn.classList.remove('seleccionada');*/
            
            dibujaNumero(fila, col, numero);

            // ELIMINAR EL NUMERO DE LOS DISPONIBLES Y ACTUALIZARLO EN STORAGE
            let numerosDisponibles = getNumeros(),
                indice = numerosDisponibles.indexOf(numero);
            
            numerosDisponibles[indice] = -1;
            setNumeros(numerosDisponibles);

            btn.remove(); // ELIMINA EL BOTON PERO NO SU CONTENEDOR, PARA SIMULAR QUE NO ESTA DISPONIBLE
            btn.classList.remove('seleccionada');

            let tablero = getTableroJuego();
            // ACTUALIZAR VALOR EN MATRIZ Y GUARDAR DE NUEVO
            tablero[fila][col] = numero;
            setTablero(tablero); // OPCIONAL EJECUTARLO AQUI TAMBIEN
            
            //COMPROBAR JUGADA Y GESTIONAR PUNTUACIONES
            let res = await postComprobar(tablero);

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
                    });
                    setTablero(tablero);

                    // PINTAR TABLERO ACTUALIZADO
                    dibujarCanvasActualizado(tablero);

                    // CAMBIAR EL TURNO Y ACTUALIZAR EL MARCADOR
                    actualizaMarcador(sumaTotal);
                } else {
                    cambiarTurno();
                }
            }
        }
    });

    // COMPROBAR SI QUEDAN NUMEROS EN LA LISTA Y SI NO SE GENERAN NUEVOS
    if (document.querySelectorAll('div#numsDisponibles>div>button').length === 0) {
        creaNumerosDisponibles(obtenerNumerosAleatorios());
    }
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
    
    let puntuacionesCombinadas = Object.assign({}, ranking, puntosPartida);

    let rankingActualizado = ordenarRanking(puntuacionesCombinadas);
    setRanking(rankingActualizado);
}

/* =========================================================================== */
/* HELPERS DEL MARCADOR DE LA PARTIDA */
/* =========================================================================== */
function creaMarcador() {
    const jugadores = getJugadores(),
        turno = getTurno();
    
    let marcador = `
        <table>
            <thead>
                <tr>
                    <th>Turno</th>
                    <th>Jugador</th>
                    <th>Puntos</th>
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

function actualizaMarcador(puntos = undefined) { // ACTUALIZA MARCADOR DE TURNO Y PUNTOS
    if (puntos) {
        // ACTUALIZAR PUNTUACIONES
        let puntosJugadores = getPuntuaciones(),
            turnoActual = getTurno();
        
        puntosJugadores[turnoActual] = parseInt(puntosJugadores[turnoActual]) + puntos;
        setPuntuaciones(puntosJugadores);

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
}