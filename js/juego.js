'use strict';

document.addEventListener('DOMContentLoaded', async () => {
    if (!getJugadores()) { //NO SE ESTA JUGANDO PARTIDA (NO HAY DATOS DE JUGADORES)
        location.href = 'index.html';
    } else { // SI LOS NOMBRES DE LOS JUGADORES ESTAN DEFINIDOS
        prepararCanvas();
        creaDivisionesCanvas();

        if (!jugandoPartida()) {
            let turnoActual = elegirPrimerTurno(),
                numerosDisponibles = obtenerNumerosAleatorios(),
                nombresJugadores = getJugadores();
            
            let tablero = await getTablero();
            tablero = tablero.TABLERO;
            dibujarCeldasActualizadas(tablero);

            creaNumerosDisponibles(numerosDisponibles);
            creaMarcador();
            cambiarTurno(true);

            setInfoPartida({
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
        } else {
            let numerosDisponibles = getNumeros(),
                tablero = getTableroJuego();
            
            dibujarCeldasActualizadas(tablero);
            creaNumerosDisponibles(numerosDisponibles);
            creaMarcador();

            let turno = getTurno()
            setTurnoMarcador(turno);
        }

        mostrarModalTurno();
    }
});