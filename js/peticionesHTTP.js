function getTablero() {
    return new Promise((resolve, reject) => {
        fetch('api/tablero')
        .then(res => res.json())
        .then(tablero => {
            resolve(tablero);
        });
    });
}

function postComprobar(tablero) {
    let fd = new FormData();
    fd.append('tablero', JSON.stringify(tablero));

    return new Promise((resolve, reject) => {
        fetch('api/comprobar', {
            method: 'POST',
            body: fd
        })
        .then(res => res.json())
        .then(tablero => {
            resolve(tablero);
        });
    });
}