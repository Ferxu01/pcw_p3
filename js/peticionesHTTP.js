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
    let body = {
        tablero: tablero
    };

    let cuerpo = JSON.stringify(body);
    console.warn(cuerpo);

    return new Promise((resolve, reject) => {
        fetch('api/comprobar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: cuerpo
        })
        .then(res => res.json())
        .then(tablero => {
            resolve(tablero);
        });
    });
}