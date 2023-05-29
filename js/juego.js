'use strict';

document.addEventListener('DOMContentLoaded', async () => {

    if (!obtieneJugadores()) { //NO SE ESTA JUGANDO PARTIDA
        location.href = 'index.html';
    } else { //SE ESTA JUGANDO PARTIDA
        if (obtienePartida()) {

        } else { //EXISTE PARTIDA Y SE VA A INICIAR
            creaMarcador();
            prepararCanvas();
            creaDivisionesCanvas();

            let turnoActual = elegirPrimerTurno(),
                numerosDisponibles = obtenerNumerosAleatorios(),
                nombresJugadores = obtieneJugadores();
            
            let tablero = await getTablero();
            tablero = tablero.TABLERO;
            dibujarCeldasActualizadas(tablero);

            creaNumerosDisponibles(numerosDisponibles);

            guardarInfoPartida({
                tablero,
                nombres: {
                    jugador1: nombresJugadores.jugador1,
                    jugador2: nombresJugadores.jugador2
                },
                turnoActual,
                numerosDisponibles,
                puntuacionesPartida: {
                    [nombresJugadores.jugador1]: 0,
                    [nombresJugadores.jugador2]: 0
                }
            });

            mostrarModalTurno();
        }
    }

});