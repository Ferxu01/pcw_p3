function getTablero() {
    return new Promise((resolve, reject) => {
        fetch('api/tablero')
        .then(res => res.json())
        .then(tablero => {
            resolve(tablero);
        });
    });
}