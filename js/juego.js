'use strict';

document.addEventListener('DOMContentLoaded', async () => {

    if (!obtieneJugadores()) { //NO SE ESTA JUGANDO PARTIDA
        location.href = 'index.html';
    } else { //SE ESTA JUGANDO PARTIDA
        if (obtienePartida()) { 
            
        } else { //EXISTE PARTIDA Y SE VA A INICIAR
            let tablero = await getTablero();
            
        }
    }

});