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

function cambiarTurno() {
    let jugadores = getJugadores(),
        turno = getTurno(),
        nuevoTurno,
        celdasTurno = document.getElementsByClassName('celdaTurno');
    
    if (turno === jugadores['jugador1'])
        nuevoTurno = jugadores['jugador2'];
    else
        nuevoTurno = jugadores['jugador1'];
    
    if (celdasTurno[0].textContent === '*') {
        celdasTurno[0].textContent === '';
        celdasTurno[1].textContent === '*';
    } else {
        celdasTurno[0].textContent === '*';
        celdasTurno[1].textContent === '';
    }
    
    setTurno(nuevoTurno);
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
    const divNumsDisponibles = document.getElementById('numsDisponibles');
    let html = '';
    numeros.forEach(num => {
        html += `
            <button type="button" onclick="seleccionaNumeroDisponible(event)">${num}</button>
        `;
    });

    divNumsDisponibles.innerHTML = html;

}

function compruebaSeleccionados() {
    return document.querySelectorAll('div#numsDisponibles>button.seleccionada').length === 0;
}

// COMPRUEBA SI HAY MAS DE UN NUMERO SELECCIONADO
function seleccionaNumeroDisponible(evt) {
    if (compruebaSeleccionados()) {
        evt.target.classList.add('seleccionada');
    } else {
        evt.target.classList.remove('seleccionada');
    }
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

            let tablero = getTableroJuego();
            console.warn(tablero);

            // ACTUALIZAR VALOR EN MATRIZ Y GUARDAR DE NUEVO
            tablero[fila][col] = numero;
            setTablero(tablero); // OPCIONAL EJECUTARLO AQUI TAMBIEN
            
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
                    });
                    setTablero(tablero);

                    console.log(tablero);

                    // PINTAR TABLERO ACTUALIZADO
                    dibujarCanvasActualizado(tablero);

                    // CAMBIAR EL TURNO Y ACTUALIZAR EL MARCADOR
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
/* HELPERS DEL MARCADOR DE LA PARTIDA */
/* =========================================================================== */
function creaMarcador() {
    const jugadores = getJugadores(),
        turno = getTurno();
    
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

    cambiarTurno();
}