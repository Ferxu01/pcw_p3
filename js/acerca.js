'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let links = document.getElementsByTagName('li');

    if (jugandoPartida()) {
        links[1].remove();
    } else {
        links[0].remove();
    }
});