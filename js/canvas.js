'use strict';

/* =========================================================================== */
/* HELPERS PARA PREPARAR EL TABLERO DE LA PARTIDA */
/* =========================================================================== */
const ANCHO = 480;
const ALTO = 360;
const NUM_CELDAS = 4;

function getCanvas() {
    return document.querySelector('#tableroJuego');
}

function getCanvasContext() {
    let cv = getCanvas();
    return cv.getContext('2d');
}

function getAnchoCelda() {
    return ANCHO / NUM_CELDAS;
}

function getAltoCelda() {
    return ALTO / NUM_CELDAS;
}

function prepararCanvas() {
    let cv = getCanvas();

    cv.width = ANCHO;
    cv.height = ALTO;

    return cv;
}

function creaDivisionesCanvas() {
    let cv = getCanvas(),
        ctx = getCanvasContext(),
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

function destacarCelda(fila, col) {
    let ctx = getCanvasContext();

    let x = getAnchoCelda()*col,
        y = getAltoCelda()*fila;
    
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, getAnchoCelda(), getAltoCelda());

    ctx.stroke();
}

function borrarCeldaDestacada(fila, col) {
    let ctx = getCanvasContext(), 
        x = getAnchoCelda()*col,
        y = getAltoCelda()*fila;

    if (fila !== undefined && col !== undefined) {
        ctx.clearRect(x, y, getAnchoCelda(), getAltoCelda());

        let tablero = getTableroJuego();
        dibujarCanvasActualizado(tablero);
    }
}

function setPunteroMouse(evt) {
    let { fila, col } = obtenerPosicionCelda(evt);
    borrarCeldaDestacada(fila, col);
    
    if (compruebaSeleccionados()) { // SI NO SE HA SELECCIONADO NINGUN NUMERO
        // CAMBIAR ESTILO DE PUNTERO A NOT-ALLOWED
        evt.target.style.cursor = 'not-allowed';
    } else {
        if (compruebaCeldaHabilitada(fila, col)) {
            if (!compruebaCeldaDisponible(fila, col)) {
                evt.target.style.cursor = 'not-allowed';
            } else {
                // DESTACAR CELDA QUE SE PASA POR ENCIMA
                destacarCelda(fila, col);
                // CAMBIAR PUNTERO A TIPO MANO
                evt.target.style.cursor = 'pointer';
            }
        } else {
            evt.target.style.cursor = 'not-allowed';
        }
    }
}

function dibujarCeldasActualizadas(tablero) {
    let ctx = getCanvasContext();

    if (tablero) {
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
}

// IMPRIME EL NÚMERO CORRESPONDIENTE EN LA CELDA SELECCIONADA
function dibujaNumero(i, j, numero = '') {
    let ctx = getCanvasContext();

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

function dibujarCanvasActualizado(tablero) {
    let cvs = getCanvas(),
        ctx = getCanvasContext();
    
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    creaDivisionesCanvas();
    dibujarCeldasActualizadas(tablero);
}

