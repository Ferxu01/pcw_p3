'use strict';

document.addEventListener('DOMContentLoaded', async () => {
    if (!getJugadores()) { //NO SE ESTA JUGANDO PARTIDA (NO HAY DATOS DE JUGADORES)
        location.href = 'index.html';
    } else { // SI LOS NOMBRES DE LOS JUGADORES ESTAN DEFINIDOS
        /*if (!jugandoPartida()) {
            console.log('breakpoint 2');
        } else { //EXISTE PARTIDA Y SE VA A INICIAR
            console.log('breakpoint 3');

            prepararCanvas();
            creaDivisionesCanvas();

            let turnoActual = getTurno() ?? undefined;

            if (turnoActual === undefined) {
                turnoActual = elegirPrimerTurno();
            }
            
            let numerosDisponibles = obtenerNumerosAleatorios(),
                nombresJugadores = getJugadores();
            
            let tablero = await getTablero();
            tablero = tablero.TABLERO;
            dibujarCeldasActualizadas(tablero);

            creaNumerosDisponibles(numerosDisponibles);
            creaMarcador();

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

            mostrarModalTurno();
        }*/

        prepararCanvas();
        creaDivisionesCanvas();

        let turnoActual = getTurno() ?? undefined;

        if (turnoActual === undefined) {
            turnoActual = elegirPrimerTurno();
        }
        
        let numerosDisponibles = obtenerNumerosAleatorios(),
            nombresJugadores = getJugadores();
        
        let tablero = await getTablero();
        tablero = tablero.TABLERO;
        dibujarCeldasActualizadas(tablero);

        creaNumerosDisponibles(numerosDisponibles);
        creaMarcador();

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

        mostrarModalTurno();
    }
});