'use strict';

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
    const turno = getTurno(), 
        modal = creaPropiedadesModal();
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
    const marcador = getPuntuaciones();
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
        <button class="modal" onclick="cerrarModal(true)">Aceptar</button>
    `;

    document.body.appendChild(modal);
    modal.showModal();
}

function cerrarModal(finPartida = false) {
    document.querySelector('dialog').close();
    document.querySelector('dialog').remove();

    let ranking = getRanking(),
        puntuaciones = getPuntuaciones();

    if (finPartida) {
        if (ranking) {
            // FUSIONAR LAS PUNTUACIONES Y EL RANKING ANTERIOR
            let nuevoRanking = Object.assign({}, ranking, puntuaciones);
            setRanking(nuevoRanking);
        } else {
            setRanking(puntuaciones);
        }

        // ACTUALIZAR RANKING
        seleccionaMejoresRanking();

        // BORRAR INFORMACION DE PARTIDA
        eliminarInfoPartida();
        location.href = 'index.html';
    }
}